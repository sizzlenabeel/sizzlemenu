import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createQuerySignal } from "@/lib/queryTimeout";

interface LocationRecord {
  id: string;
  name: string;
}

export function useLocation(dynamoId?: string) {
  return useQuery({
    queryKey: ["location", dynamoId],
    enabled: Boolean(dynamoId),
    retry: 1,
    queryFn: async ({ signal: parentSignal }): Promise<LocationRecord> => {
      const { signal, cleanup } = createQuerySignal(parentSignal);

      try {
        const { data, error } = await supabase
          .from("locations")
          .select("id, name")
          .eq("dynamo_id", dynamoId)
          .eq("is_active", true)
          .abortSignal(signal)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Location not found");

        return data;
      } finally {
        cleanup();
      }
    },
  });
}
