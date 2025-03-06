
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
        No articles found matching your criteria. Try adjusting your search terms or filters.
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500">
      Showing {articlesCount} article{articlesCount === 1 ? '' : 's'} of {totalCount} total result{totalCount === 1 ? '' : 's'}
    </div>
  );
};
