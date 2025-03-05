
import { useState } from "react";
import { FilterOptions } from "@/components/sidebar/types";

export function useFilterState() {
  const [filters, setFilters] = useState<FilterOptions>({ 
    proteinFamily: [], 
    proteinType: [],
    proteinCategory: [],
    proteinSubcategory: [],
    showBookmarksOnly: false,
    sortDirection: 'desc',
    showReviewsOnly: false,
    excludeReviews: false,
    startDate: null,
    endDate: null
  });

  const handleFilterChange = (newFilters: { 
    proteinFamily: string[], 
    proteinType?: string[],
    proteinCategory?: string[],
    proteinSubcategory?: string[],
    showBookmarksOnly?: boolean,
    sortDirection?: 'asc' | 'desc',
    showReviewsOnly?: boolean,
    excludeReviews?: boolean,
    startDate?: Date | null,
    endDate?: Date | null
  }) => {
    console.log("Filter change in useFilterState hook:", newFilters);
    
    setFilters(prev => ({
      ...prev,
      proteinFamily: newFilters.proteinFamily,
      proteinType: newFilters.proteinType ?? prev.proteinType,
      proteinCategory: newFilters.proteinCategory ?? prev.proteinCategory,
      proteinSubcategory: newFilters.proteinSubcategory ?? prev.proteinSubcategory,
      showBookmarksOnly: newFilters.showBookmarksOnly ?? prev.showBookmarksOnly,
      sortDirection: newFilters.sortDirection ?? prev.sortDirection,
      showReviewsOnly: newFilters.showReviewsOnly ?? prev.showReviewsOnly,
      excludeReviews: newFilters.excludeReviews ?? prev.excludeReviews,
      startDate: newFilters.startDate !== undefined ? newFilters.startDate : prev.startDate,
      endDate: newFilters.endDate !== undefined ? newFilters.endDate : prev.endDate
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      proteinFamily: [],
      proteinType: [],
      proteinCategory: [],
      proteinSubcategory: [],
      showBookmarksOnly: false,
      sortDirection: 'desc',
      showReviewsOnly: false,
      excludeReviews: false,
      startDate: null,
      endDate: null
    });
  };

  const handleClearFilter = (type: 'category' | 'subcategory' | 'proteinFamily' | 'proteinType' | 'date' | 'viewOption', value: string) => {
    if (type === 'category') {
      // When clearing a category, also clear its subcategories
      const categoryToRemove = value;
      // Find all subcategories that belong to this category to remove them
      const categoryIndex = value.indexOf('. ');
      const categoryName = categoryIndex !== -1 ? value.substring(categoryIndex + 2) : value;
      
      setFilters(prev => ({
        ...prev,
        proteinCategory: prev.proteinCategory.filter(c => !c.includes(categoryName)),
        // Remove subcategories that start with the category name
        proteinSubcategory: prev.proteinSubcategory.filter(sc => !sc.startsWith(`${categoryName}: `))
      }));
    } else if (type === 'subcategory') {
      // Just remove the specific subcategory
      setFilters(prev => ({
        ...prev,
        proteinSubcategory: prev.proteinSubcategory.filter(sc => sc !== value)
      }));
    } else if (type === 'proteinFamily') {
      // Remove the specific protein family
      setFilters(prev => ({
        ...prev,
        proteinFamily: prev.proteinFamily.filter(f => f !== value)
      }));
    } else if (type === 'proteinType') {
      // Remove the specific protein type
      setFilters(prev => ({
        ...prev,
        proteinType: prev.proteinType.filter(t => t !== value)
      }));
    } else if (type === 'date') {
      // Clear date range
      setFilters(prev => ({
        ...prev,
        startDate: null,
        endDate: null
      }));
    } else if (type === 'viewOption') {
      // Clear specific view option based on value
      if (value === 'showBookmarksOnly') {
        setFilters(prev => ({ ...prev, showBookmarksOnly: false }));
      } else if (value === 'showReviewsOnly') {
        setFilters(prev => ({ ...prev, showReviewsOnly: false }));
      } else if (value === 'excludeReviews') {
        setFilters(prev => ({ ...prev, excludeReviews: false }));
      }
    }
  };

  return {
    filters,
    handleFilterChange,
    handleClearFilter,
    clearAllFilters
  };
}
