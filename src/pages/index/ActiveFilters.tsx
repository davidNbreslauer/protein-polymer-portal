
import { X } from "lucide-react";
import { format } from "date-fns";

type ActiveFilter = {
  type: 'category' | 'subcategory' | 'proteinFamily' | 'proteinType' | 'date' | 'viewOption';
  value: string;
  display: string;
};

interface ActiveFiltersProps {
  proteinCategories: string[];
  proteinSubcategories: string[];
  proteinFamilies: string[];
  proteinTypes: string[];
  startDate: Date | null;
  endDate: Date | null;
  showBookmarksOnly: boolean;
  showReviewsOnly: boolean;
  excludeReviews: boolean;
  onClearFilter: (type: 'category' | 'subcategory' | 'proteinFamily' | 'proteinType' | 'date' | 'viewOption', value: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters = ({ 
  proteinCategories, 
  proteinSubcategories,
  proteinFamilies,
  proteinTypes,
  startDate,
  endDate,
  showBookmarksOnly,
  showReviewsOnly,
  excludeReviews,
  onClearFilter, 
  onClearAll 
}: ActiveFiltersProps) => {
  // Format active filters for display
  const activeFilters: ActiveFilter[] = [
    // Protein Categories
    ...proteinCategories.map(cat => {
      const categoryMatch = cat.match(/^\d+\.\s(.*)/);
      const displayName = categoryMatch ? categoryMatch[1] : cat;
      return { type: 'category' as const, value: cat, display: displayName };
    }),
    
    // Protein Subcategories
    ...proteinSubcategories.map(sub => ({ 
      type: 'subcategory' as const, 
      value: sub, 
      display: sub 
    })),
    
    // Protein Families
    ...proteinFamilies.map(family => ({ 
      type: 'proteinFamily' as const, 
      value: family, 
      display: family 
    })),
    
    // Protein Types
    ...proteinTypes.map(type => ({ 
      type: 'proteinType' as const, 
      value: type, 
      display: type 
    })),
    
    // Date Range (if either start or end date is set)
    ...(startDate || endDate ? [{
      type: 'date' as const,
      value: 'dateRange',
      display: `Date: ${startDate ? format(startDate, 'MMM d, yyyy') : 'Any'} - ${endDate ? format(endDate, 'MMM d, yyyy') : 'Any'}`
    }] : []),
    
    // View Options
    ...(showBookmarksOnly ? [{
      type: 'viewOption' as const,
      value: 'showBookmarksOnly',
      display: 'Bookmarks Only'
    }] : []),
    
    ...(showReviewsOnly ? [{
      type: 'viewOption' as const,
      value: 'showReviewsOnly',
      display: 'Reviews Only'
    }] : []),
    
    ...(excludeReviews ? [{
      type: 'viewOption' as const,
      value: 'excludeReviews',
      display: 'Exclude Reviews'
    }] : [])
  ];

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Active Filters</h3>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <button
            key={`${filter.type}-${index}`}
            onClick={() => onClearFilter(filter.type, filter.value)}
            className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm"
          >
            {filter.display}
            <X className="ml-1 w-4 h-4" />
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};
