
interface ResultsInfoProps {
  articlesCount: number;
  totalCount: number;
  isLoading: boolean;
  hasError: boolean;
}

export const ResultsInfo = ({ articlesCount, totalCount, isLoading, hasError }: ResultsInfoProps) => {
  if (isLoading || hasError) return null;
  
  if (articlesCount === 0) {
    return (
      <div className="text-sm text-gray-500">
        No articles found matching your criteria.
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500">
      Showing {articlesCount} article{articlesCount === 1 ? '' : 's'} of {totalCount} total result{totalCount === 1 ? '' : 's'}
    </div>
  );
};
