
interface ResultsInfoProps {
  articlesCount: number;
  totalCount: number;
  isLoading: boolean;
  hasError: boolean;
  showReviewsOnly?: boolean;
  excludeReviews?: boolean;
}

export const ResultsInfo = ({ 
  articlesCount, 
  totalCount, 
  isLoading, 
  hasError,
  showReviewsOnly,
  excludeReviews
}: ResultsInfoProps) => {
  if (isLoading || hasError) return null;
  
  if (articlesCount === 0) {
    return (
      <div className="text-sm text-gray-500">
        No articles found matching your criteria.
      </div>
    );
  }

  // Add filter description based on review filters
  let filterDescription = '';
  if (showReviewsOnly) {
    filterDescription = ' (reviews only)';
  } else if (excludeReviews) {
    filterDescription = ' (excluding reviews)';
  }

  return (
    <div className="text-sm text-gray-500">
      Showing {articlesCount} article{articlesCount === 1 ? '' : 's'} of {totalCount} total result{totalCount === 1 ? '' : 's'}{filterDescription}
    </div>
  );
};
