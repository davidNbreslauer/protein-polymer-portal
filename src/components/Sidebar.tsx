
import { useState, forwardRef, useImperativeHandle } from "react";
import { Filter } from "lucide-react";
import { SortSection } from "./sidebar/SortSection";
import { ViewOptionsSection } from "./sidebar/ViewOptionsSection";
import { DateRangeSection } from "./sidebar/DateRangeSection";
import { ProteinFamilySection } from "./sidebar/ProteinFamilySection";
import { ProteinTypeSection } from "./sidebar/ProteinTypeSection";
import { ProteinCategorySection } from "./sidebar/ProteinCategorySection";
import { ApplicationSection } from "./sidebar/ApplicationSection";
import { TestedPropertiesSection } from "./sidebar/TestedPropertiesSection";
import { FilterOptions, FilterProps } from "./sidebar/types";

// Define the ref type
export interface SidebarRef {
  clearAll: () => void;
}

export const Sidebar = forwardRef<SidebarRef, FilterProps>(({ onFilterChange }, ref) => {
  const [selectedProteinFamilies, setSelectedProteinFamilies] = useState<string[]>([]);
  const [selectedProteinTypes, setSelectedProteinTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [showReviewsOnly, setShowReviewsOnly] = useState(false);
  const [excludeReviews, setExcludeReviews] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const currentFilters: FilterOptions = {
    proteinFamily: selectedProteinFamilies,
    proteinType: selectedProteinTypes,
    proteinCategory: selectedCategories,
    proteinSubcategory: selectedSubcategories,
    showBookmarksOnly,
    sortDirection,
    showReviewsOnly,
    excludeReviews,
    startDate,
    endDate
  };

  // Expose the clearAll method to parent components via ref
  useImperativeHandle(ref, () => ({
    clearAll: handleClearAll
  }));

  const handleClearAll = () => {
    setSelectedProteinFamilies([]);
    setSelectedProteinTypes([]);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setShowBookmarksOnly(false);
    setSortDirection('desc');
    setShowReviewsOnly(false);
    setExcludeReviews(false);
    setStartDate(null);
    setEndDate(null);
    
    // Explicitly call onFilterChange with the reset values
    onFilterChange({
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

  const handleDateChange = (newStartDate: Date | null, newEndDate: Date | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onFilterChange({
      ...currentFilters,
      startDate: newStartDate,
      endDate: newEndDate
    });
  };

  return (
    <aside className="w-64">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </div>
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <SortSection
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
          />

          <ViewOptionsSection
            showBookmarksOnly={showBookmarksOnly}
            setShowBookmarksOnly={setShowBookmarksOnly}
            showReviewsOnly={showReviewsOnly}
            setShowReviewsOnly={setShowReviewsOnly}
            excludeReviews={excludeReviews}
            setExcludeReviews={setExcludeReviews}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
          />

          <DateRangeSection 
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            currentFilters={currentFilters}
          />

          <ProteinCategorySection
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedSubcategories={selectedSubcategories}
            setSelectedSubcategories={setSelectedSubcategories}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
          />

          <ProteinFamilySection
            selectedProteinFamilies={selectedProteinFamilies}
            setSelectedProteinFamilies={setSelectedProteinFamilies}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
          />

          <ProteinTypeSection
            selectedProteinTypes={selectedProteinTypes}
            setSelectedProteinTypes={setSelectedProteinTypes}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
          />

          <ApplicationSection />

          <TestedPropertiesSection />
        </div>
      </div>
    </aside>
  );
});

// Display name for debugging purposes
Sidebar.displayName = "Sidebar";
