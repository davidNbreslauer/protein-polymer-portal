
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProteinFamilyData {
  name: string;
  count: number;
}

export const useProteinFamilies = () => {
  const [proteinFamilies, setProteinFamilies] = useState<ProteinFamilyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProteinFamilies = async () => {
      setIsLoading(true);
      try {
        // Predefined protein families
        const families = ["Elastomeric proteins", "Spider Silk", "Resilin", "Calmodulin"];
        
        // Get counts for each family
        const familiesWithCounts = await Promise.all(
          families.map(async (family) => {
            const { count, error } = await supabase
              .from('articles')
              .select('*', { count: 'exact', head: true })
              .contains('facets_protein_family', [family]);
            
            if (error) throw error;
            
            return {
              name: family,
              count: count || 0
            };
          })
        );
        
        // Sort by count in descending order
        const sortedFamilies = familiesWithCounts.sort((a, b) => b.count - a.count);
        
        setProteinFamilies(sortedFamilies);
      } catch (error) {
        console.error('Error fetching protein families:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProteinFamilies();
  }, []);

  return { proteinFamilies, isLoading };
};
