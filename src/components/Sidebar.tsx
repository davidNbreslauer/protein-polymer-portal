
import { useState } from "react";
import { Filter } from "lucide-react";
import { SortSection } from "./sidebar/SortSection";
import { ViewOptionsSection } from "./sidebar/ViewOptionsSection";
import { DateRangeSection } from "./sidebar/DateRangeSection";
import { ProteinFamilySection } from "./sidebar/ProteinFamilySection";
import { ProteinTypeSection } from "./sidebar/ProteinTypeSection";
import { ApplicationSection } from "./sidebar/ApplicationSection";
import { TestedPropertiesSection } from "./sidebar/TestedPropertiesSection";
import { FilterOptions, FilterProps } from "./sidebar/types";

export const Sidebar = ({ onFilterChange }: FilterProps) => {
  const [selectedProteinFamilies, setSelectedProteinFamilies] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [showReviewsOnly, setShowReviewsOnly] = useState(false);
  const [excludeReviews, setExcludeReviews] = useState(false);

  const currentFilters: FilterOptions = {
    proteinFamily: selectedProteinFamilies,
    showBookmarksOnly,
    sortDirection,
    showReviewsOnly,
    excludeReviews
  };

  const handleClearAll = () => {
    setSelectedProteinFamilies([]);
    setShowBookmarksOnly(false);
    setSortDirection('desc');
    setShowReviewsOnly(false);
    setExcludeReviews(false);
    onFilterChange({
      proteinFamily: [],
      showBookmarksOnly: false,
      sortDirection: 'desc',
      showReviewsOnly: false,
      excludeReviews: false
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

          <DateRangeSection />

          <ProteinFamilySection
            selectedProteinFamilies={selectedProteinFamilies}
            setSelectedProteinFamilies={setSelectedProteinFamilies}
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
          />

          <ProteinTypeSection />

          <ApplicationSection />

          <TestedPropertiesSection />
        </div>
      </div>
    </aside>
  );
};

