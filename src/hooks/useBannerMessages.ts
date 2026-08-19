import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BannerMessage {
  id: string;
  message: string;
  link_label: string | null;
  link_url: string | null;
}

export function useBannerMessages() {
  return useQuery({
    queryKey: ["banner-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banner_messages")
        .select("id, message, link_label, link_url")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BannerMessage[];
    },
  });
}
