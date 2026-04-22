import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LocationRecord {
  id: string;
  name: string;
}

export function useLocation(dynamoId?: string) {
  return useQuery({
    queryKey: ["location", dynamoId],
    enabled: Boolean(dynamoId),
    queryFn: async (): Promise<LocationRecord> => {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name")
        .eq("dynamo_id", dynamoId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error("Location not found");
      }

      return data;
    },
  });
}
