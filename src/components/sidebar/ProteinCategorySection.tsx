
import { useState } from "react";
import { FilterOptions, FilterProps } from "./types";
import { useProteinCategories } from "@/hooks/useProteinCategories";
import { ProteinCategory } from "./category/ProteinCategory";

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
  const { categoriesData, isLoading } = useProteinCategories();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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
      newCategories = selectedCategories.filter(c => c !== category);
      const categoryData = categoriesData.find(c => c.category === category);
      const subcategoriesToRemove = categoryData?.subcategories.map(sc => sc.name) || [];
      newSubcategories = selectedSubcategories.filter(sc => !subcategoriesToRemove.includes(sc));
    } else {
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
      newSubcategories = selectedSubcategories.filter(sc => sc !== subcategory);
    } else {
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
        {categoriesData.map((categoryData) => (
          <ProteinCategory
            key={categoryData.category}
            categoryData={categoryData}
            isExpanded={expandedCategories.includes(categoryData.category)}
            onToggleExpand={toggleCategory}
            isSelected={selectedCategories.includes(categoryData.category)}
            onCategorySelect={handleCategorySelect}
            selectedSubcategories={selectedSubcategories}
            onSubcategorySelect={handleSubcategorySelect}
          />
        ))}
      </div>
    </div>
  );
};
