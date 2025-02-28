
import { X } from "lucide-react";

type ActiveFilter = {
  type: 'category' | 'subcategory';
  value: string;
  display: string;
};

interface ActiveFiltersProps {
  proteinCategories: string[];
  proteinSubcategories: string[];
  onClearFilter: (type: 'category' | 'subcategory', value: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters = ({ 
  proteinCategories, 
  proteinSubcategories,
  onClearFilter, 
  onClearAll 
}: ActiveFiltersProps) => {
  // Format active filters for display
  const activeFilters: ActiveFilter[] = [
    ...proteinCategories.map(cat => {
      // Find the index if it starts with a number followed by dot and space
      const categoryMatch = cat.match(/^\d+\.\s(.*)/);
      const displayName = categoryMatch ? categoryMatch[1] : cat;
      return { type: 'category' as const, value: cat, display: displayName };
    }),
    ...proteinSubcategories.map(sub => ({ type: 'subcategory' as const, value: sub, display: sub }))
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
