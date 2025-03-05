
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProteinTypeData {
  name: string;
  count: number;
}

export const useProteinTypes = () => {
  const [proteinTypes, setProteinTypes] = useState<ProteinTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProteinTypes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('proteins')
          .select('type')
          .not('type', 'is', null)
          .then(result => {
            if (result.error) throw result.error;
            const types = Array.from(new Set(result.data
              .map(protein => protein.type)
              .filter((type): type is string => !!type)
            )).sort();
            return { data: types, error: null };
          });

        if (error) {
          console.error('Error fetching protein types:', error);
          return;
        }

        // Get counts for each type
        const typesWithCounts = await Promise.all(
          (data || []).map(async (type) => {
            const { count, error: countError } = await supabase
              .from('proteins')
              .select('*', { count: 'exact', head: true })
              .eq('type', type);
            
            if (countError) throw countError;
            
            return {
              name: type,
              count: count || 0
            };
          })
        );
        
        // Sort by count in descending order
        const sortedTypes = typesWithCounts.sort((a, b) => b.count - a.count);
        
        setProteinTypes(sortedTypes);
      } catch (error) {
        console.error('Error fetching protein types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProteinTypes();
  }, []);

  return { proteinTypes, isLoading };
};
