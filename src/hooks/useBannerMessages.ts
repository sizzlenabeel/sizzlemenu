import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BannerMessage {
  id: string;
  message: string;
  link_label: string | null;
  link_url: string | null;
  product_id: string | null;
}

function isMissingActiveBannerView(error: { code?: string }) {
  return error.code === "PGRST205" || error.code === "42P01";
}

export function useBannerMessages() {
  return useQuery({
    queryKey: ["banner-messages"],
    queryFn: async () => {
      const activeResult = await supabase
        .from("active_banner_messages")
        .select("id, message, link_label, link_url, product_id")
        .order("created_at", { ascending: false });

      let banners: BannerMessage[];
      if (!activeResult.error) {
        banners = (activeResult.data || []).filter(
          (banner): banner is BannerMessage => Boolean(banner.id && banner.message),
        );
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
        }));
      }

      return banners;
    },
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
