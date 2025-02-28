
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FilterOptions, FilterProps } from "./types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

interface CategoryData {
  category: string;
  subcategories: {
    name: string;
    count: number;
  }[];
  count: number;
}

interface ProteinCategorySectionProps extends FilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedSubcategories: string[];
  setSelectedSubcategories: (subcategories: string[]) => void;
  currentFilters: FilterOptions;
}

export const ProteinCategorySection = ({
  selectedCategories,
  setSelectedCategories,
  selectedSubcategories,
  setSelectedSubcategories,
  onFilterChange,
  currentFilters
}: ProteinCategorySectionProps) => {
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setIsLoading(true);
      try {
        // First get all unique categories
        const { data: categoriesResult, error: categoriesError } = await supabase
          .from('protein_classifications')
          .select('category')
          .order('category')
          .then(result => {
            if (result.error) throw result.error;
            // Get unique categories
            const uniqueCategories = Array.from(
              new Set(result.data.map(item => item.category))
            );
            return { 
              data: uniqueCategories.map(category => ({ category })), 
              error: null 
            };
          });

        if (categoriesError) throw categoriesError;

        // For each category, get subcategories and counts
        const categoriesWithData = await Promise.all(
          (categoriesResult || []).map(async ({ category }) => {
            // Get subcategories for this category
            const { data: subcategoriesData, error: subcategoriesError } = await supabase
              .from('protein_classifications')
              .select('subcategory')
              .eq('category', category)
              .order('subcategory');
            
            if (subcategoriesError) throw subcategoriesError;
            
            // Get count of articles for this category
            const { count: categoryCount, error: categoryCountError } = await supabase
              .from('articles')
              .select('*', { count: 'exact', head: true })
              .contains('facets_protein_categories', [category]);
            
            if (categoryCountError) throw categoryCountError;
            
            // Get counts for each subcategory
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
            
            return {
              category,
              subcategories: subcategoriesWithCounts,
              count: categoryCount || 0
            };
          })
        );
        
        setCategoriesData(categoriesWithData);
      } catch (error) {
        console.error('Error fetching protein categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleCategorySelect = (category: string) => {
    const isSelected = selectedCategories.includes(category);
    let newCategories: string[];
    let newSubcategories: string[];
    
    if (isSelected) {
      // If deselecting category, remove it and all its subcategories
      newCategories = selectedCategories.filter(c => c !== category);
      
      // Remove all subcategories that belong to this category
      const categoryData = categoriesData.find(c => c.category === category);
      const subcategoriesToRemove = categoryData?.subcategories.map(sc => sc.name) || [];
      newSubcategories = selectedSubcategories.filter(sc => !subcategoriesToRemove.includes(sc));
    } else {
      // If selecting category, add it
      newCategories = [...selectedCategories, category];
      newSubcategories = selectedSubcategories;
    }
    
    setSelectedCategories(newCategories);
    setSelectedSubcategories(newSubcategories);
    
    onFilterChange({
      ...currentFilters,
      proteinCategory: newCategories,
      proteinSubcategory: newSubcategories
    });
  };

  const handleSubcategorySelect = (subcategory: string, category: string) => {
    const isSelected = selectedSubcategories.includes(subcategory);
    let newSubcategories: string[];
    let newCategories = selectedCategories;
    
    if (isSelected) {
      // If deselecting subcategory, just remove it
      newSubcategories = selectedSubcategories.filter(sc => sc !== subcategory);
    } else {
      // If selecting subcategory, add it and ensure its category is also selected
      newSubcategories = [...selectedSubcategories, subcategory];
      if (!newCategories.includes(category)) {
        newCategories = [...newCategories, category];
      }
    }
    
    setSelectedSubcategories(newSubcategories);
    setSelectedCategories(newCategories);
    
    onFilterChange({
      ...currentFilters,
      proteinCategory: newCategories,
      proteinSubcategory: newSubcategories
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Protein Categories</h3>
        <div className="space-y-2 animate-pulse">
          <div className="h-5 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Protein Categories</h3>
      <div className="space-y-2">
        {categoriesData.map((categoryData, index) => (
          <Collapsible 
            key={categoryData.category} 
            open={expandedCategories.includes(categoryData.category)}
            onOpenChange={() => toggleCategory(categoryData.category)}
            className="border-b border-gray-100 pb-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CollapsibleTrigger className="flex items-center mr-2">
                  {expandedCategories.includes(categoryData.category) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </CollapsibleTrigger>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(categoryData.category)}
                    onChange={() => handleCategorySelect(categoryData.category)}
                    className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {index + 1}. {categoryData.category}
                  </span>
                </label>
              </div>
              <span className="text-sm text-gray-500">{categoryData.count}</span>
            </div>
            
            <CollapsibleContent className="pl-9 space-y-1 mt-1">
              {categoryData.subcategories.map((subcategory) => (
                <div key={subcategory.name} className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(subcategory.name)}
                      onChange={() => handleSubcategorySelect(subcategory.name, categoryData.category)}
                      className="rounded border-gray-300 text-primary focus:ring-primary/20"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      <Plus className="h-3 w-3 inline mr-1 text-gray-400" />
                      {subcategory.name}
                    </span>
                  </label>
                  <span className="text-sm text-gray-500">{subcategory.count}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};
