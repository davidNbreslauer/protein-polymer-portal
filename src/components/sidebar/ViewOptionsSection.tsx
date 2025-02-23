
import { FilterOptions, FilterProps } from "./types";

interface ViewOptionsSectionProps extends FilterProps {
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (show: boolean) => void;
  showReviewsOnly: boolean;
  setShowReviewsOnly: (show: boolean) => void;
  excludeReviews: boolean;
  setExcludeReviews: (exclude: boolean) => void;
  currentFilters: FilterOptions;
}

export const ViewOptionsSection = ({
  showBookmarksOnly,
  setShowBookmarksOnly,
  showReviewsOnly,
  setShowReviewsOnly,
  excludeReviews,
  setExcludeReviews,
  onFilterChange,
  currentFilters,
}: ViewOptionsSectionProps) => {
  const handleBookmarksToggle = (checked: boolean) => {
    setShowBookmarksOnly(checked);
    onFilterChange({ ...currentFilters, showBookmarksOnly: checked });
  };

  const handleReviewsToggle = (checked: boolean) => {
    setShowReviewsOnly(checked);
    if (checked) setExcludeReviews(false);
    onFilterChange({ 
      ...currentFilters, 
      showReviewsOnly: checked,
      excludeReviews: false 
    });
  };

  const handleExcludeReviewsToggle = (checked: boolean) => {
    setExcludeReviews(checked);
    if (checked) setShowReviewsOnly(false);
    onFilterChange({ 
      ...currentFilters, 
      showReviewsOnly: false,
      excludeReviews: checked 
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">View Options</h3>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showBookmarksOnly}
            onChange={(e) => handleBookmarksToggle(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary/20"
          />
          <span className="ml-2 text-sm text-gray-600">Show Bookmarks Only</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showReviewsOnly}
            onChange={(e) => handleReviewsToggle(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary/20"
            disabled={excludeReviews}
          />
          <span className="ml-2 text-sm text-gray-600">Show Reviews Only</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={excludeReviews}
            onChange={(e) => handleExcludeReviewsToggle(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary/20"
            disabled={showReviewsOnly}
          />
          <span className="ml-2 text-sm text-gray-600">Exclude Reviews</span>
        </label>
      </div>
    </div>
  );
};
