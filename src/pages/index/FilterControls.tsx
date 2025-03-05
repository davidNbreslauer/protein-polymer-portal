
import { useRef } from "react";
import { SidebarRef, Sidebar } from "@/components/Sidebar";
import { ActiveFilters } from "./ActiveFilters";
import { FilterOptions } from "@/components/sidebar/types";

interface FilterControlsProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilter: (type: 'category' | 'subcategory' | 'proteinFamily' | 'proteinType' | 'date' | 'viewOption', value: string) => void;
  onClearAll: () => void;
}

export const FilterControls = ({
  filters,
  onFilterChange,
  onClearFilter,
  onClearAll
}: FilterControlsProps) => {
  // Create a ref to the sidebar to access its clearAll method
  const sidebarRef = useRef<SidebarRef | null>(null);

  const handleClearAllFilters = () => {
    // Reset parent component filters
    onClearAll();
    
    // Also call the sidebar's clearAll function to reset its internal state
    if (sidebarRef.current) {
      sidebarRef.current.clearAll();
    }
  };

  return (
    <div className="flex gap-6">
      <div className="pt-4">
        <Sidebar 
          ref={sidebarRef}
          onFilterChange={onFilterChange} 
        />
      </div>

      <div className="flex-1 space-y-4 pt-4">
        <ActiveFilters 
          proteinCategories={filters.proteinCategory}
          proteinSubcategories={filters.proteinSubcategory}
          proteinFamilies={filters.proteinFamily}
          proteinTypes={filters.proteinType}
          startDate={filters.startDate}
          endDate={filters.endDate}
          showBookmarksOnly={filters.showBookmarksOnly}
          showReviewsOnly={filters.showReviewsOnly}
          excludeReviews={filters.excludeReviews}
          onClearFilter={onClearFilter}
          onClearAll={handleClearAllFilters}
        />
      </div>
    </div>
  );
};
