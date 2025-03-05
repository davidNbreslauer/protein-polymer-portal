
interface ResultsInfoProps {
  articlesCount: number;
  totalCount: number;
  isLoading: boolean;
  hasError: boolean;
  currentFilters?: {
    showReviewsOnly?: boolean;
    excludeReviews?: boolean;
  };
}

export const ResultsInfo = ({ 
  articlesCount, 
  totalCount, 
  isLoading, 
  hasError,
  currentFilters 
}: ResultsInfoProps) => {
  if (isLoading || hasError) return null;
  
  if (articlesCount === 0) {
    return (
      <div className="text-sm text-gray-500">
        No articles found matching your criteria.
      </div>
    );
  }

  // Create the filter description text based on current filters
  let filterDescription = '';
  if (currentFilters?.showReviewsOnly) {
    filterDescription = ' (reviews only)';
  } else if (currentFilters?.excludeReviews) {
    filterDescription = ' (excluding reviews)';
  }

  return (
    <div className="text-sm text-gray-500">
      Showing {articlesCount} article{articlesCount === 1 ? '' : 's'} of {totalCount} 
      total result{totalCount === 1 ? '' : 's'}{filterDescription}
    </div>
  );
};
