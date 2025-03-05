
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SubcategoryData {
  name: string;
  count: number;
}

export interface CategoryData {
  category: string;
  subcategories: SubcategoryData[];
  count: number;
}

export const useProteinCategories = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setIsLoading(true);
      try {
        const { data: categoriesResult, error: categoriesError } = await supabase
          .from('protein_classifications')
          .select('category')
          .order('category');
        
        if (categoriesError) throw categoriesError;
        
        const uniqueCategories = Array.from(
          new Set(categoriesResult.map(item => item.category))
        );
        
        const categoriesWithData = await Promise.all(
          uniqueCategories.map(async (category) => {
            const { data: subcategoriesData, error: subcategoriesError } = await supabase
              .from('protein_classifications')
              .select('subcategory')
              .eq('category', category)
              .order('subcategory');
            
            if (subcategoriesError) throw subcategoriesError;
            
            const { count: categoryCount, error: categoryCountError } = await supabase
              .from('articles')
              .select('*', { count: 'exact', head: true })
              .contains('facets_protein_categories', [category]);
            
            if (categoryCountError) throw categoryCountError;
            
            const subcategoriesWithCounts = await Promise.all(
              (subcategoriesData || []).map(async ({ subcategory }) => {
                const { count, error } = await supabase
                  .from('articles')
                  .select('*', { count: 'exact', head: true })
                  .contains('facets_protein_subcategories', [subcategory]);
                
                if (error) throw error;
                
                return {
                  name: subcategory,
                  count: count || 0
                };
              })
            );
            
            const sortedSubcategories = subcategoriesWithCounts.sort((a, b) => b.count - a.count);
            
            return {
              category: category,
              subcategories: sortedSubcategories,
              count: categoryCount || 0
            };
          })
        );
        
        const sortedCategories = categoriesWithData.sort((a, b) => b.count - a.count);
        
        setCategoriesData(sortedCategories);
      } catch (error) {
        console.error('Error fetching protein categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  return { categoriesData, isLoading };
};
