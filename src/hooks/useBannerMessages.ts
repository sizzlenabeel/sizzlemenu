import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BannerMessage {
  id: string;
  message: string;
  link_label: string | null;
  link_url: string | null;
  product_id: string | null;
  location_ids?: string[] | null;
}

function isMissingActiveBannerView(error: { code?: string }) {
  return error.code === "PGRST205" || error.code === "42P01";
}

function isMissingLocationColumn(error: { code?: string }) {
  return error.code === "42703" || error.code === "PGRST204";
}

/**
 * Banners with an empty location list are global; banners with locations set
 * are only shown at those locations.
 */
function matchesLocation(banner: BannerMessage, locationId?: string) {
  const locations = banner.location_ids;
  if (!locations || locations.length === 0) return true;
  return Boolean(locationId) && locations.includes(locationId as string);
}

export function useBannerMessages(locationId?: string) {
  return useQuery({
    queryKey: ["banner-messages", locationId ?? null],
    queryFn: async () => {
      type RawBanner = Partial<BannerMessage> & { id?: string | null; message?: string | null };

      let activeResult: { data: RawBanner[] | null; error: { code?: string } | null } = await supabase
        .from("active_banner_messages")
        .select("id, message, link_label, link_url, product_id, location_ids")
        .order("created_at", { ascending: false });

      // Keep working if the frontend is deployed just before the migration
      // that adds location targeting.
      if (activeResult.error && isMissingLocationColumn(activeResult.error)) {
        activeResult = await supabase
          .from("active_banner_messages")
          .select("id, message, link_label, link_url, product_id")
          .order("created_at", { ascending: false });
      }

      let banners: BannerMessage[];
      if (!activeResult.error) {
        banners = (activeResult.data || [])
          .filter((banner) => Boolean(banner.id && banner.message))
          .map((banner) => ({
            id: banner.id as string,
            message: banner.message as string,
            link_label: banner.link_label ?? null,
            link_url: banner.link_url ?? null,
            product_id: banner.product_id ?? null,
            location_ids: banner.location_ids ?? null,
          }));
      } else {
        if (!isMissingActiveBannerView(activeResult.error)) throw activeResult.error;

        // Keep existing standalone banners working if the frontend is deployed
        // just before the database migration.
        const legacyResult = await supabase
          .from("banner_messages")
          .select("id, message, link_label, link_url")
          .order("created_at", { ascending: false });
        if (legacyResult.error) throw legacyResult.error;
        banners = (legacyResult.data || []).map((banner) => ({
          ...banner,
          product_id: null,
          location_ids: null,
        }));
      }

      return banners.filter((banner) => matchesLocation(banner, locationId));
    },
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
