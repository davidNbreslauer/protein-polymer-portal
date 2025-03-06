
import { ResultsInfo } from "./ResultsInfo";
import { PageSizeSelector } from "./PageSizeSelector";
import { ArticlesList } from "./ArticlesList";
import { Article } from "@/types/article";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface SearchResultsProps {
  articles: Article[];
  totalCount: number;
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  pageSize: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageSizeChange: (value: string) => void;
  showReviewsOnly?: boolean;
  excludeReviews?: boolean;
}

export const SearchResults = ({
  articles,
  totalCount,
  isLoading,
  error,
  currentPage,
  pageSize,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
  showReviewsOnly,
  excludeReviews
}: SearchResultsProps) => {
  const { toast } = useToast();
  
  // Show toast notification for errors
  useEffect(() => {
    if (error) {
      let errorMessage = 'An error occurred while searching. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Check for specific SQL parsing errors and provide clearer message
      if (errorMessage.includes('parse logic tree') || errorMessage.includes('syntax error')) {
        errorMessage = 'Your search contains characters that cannot be processed. Please try a simpler search term.';
      }
        
      toast({
        title: "Search error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ResultsInfo 
          articlesCount={articles?.length || 0}
          totalCount={totalCount || 0}
          isLoading={isLoading}
          hasError={!!error}
          showReviewsOnly={showReviewsOnly}
          excludeReviews={excludeReviews}
        />
        {!isLoading && !error && articles?.length > 0 && (
          <PageSizeSelector
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>

      <ArticlesList
        articles={articles || []}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount || 0}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </div>
  );
};
