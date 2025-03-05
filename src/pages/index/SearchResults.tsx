
import { ResultsInfo } from "./ResultsInfo";
import { PageSizeSelector } from "./PageSizeSelector";
import { ArticlesList } from "./ArticlesList";
import { Article } from "@/types/article";
import { FilterOptions } from "@/components/sidebar/types";

interface SearchResultsProps {
  articles: Article[];
  totalCount: number;
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  pageSize: number;
  filters: FilterOptions;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageSizeChange: (value: string) => void;
}

export const SearchResults = ({
  articles,
  totalCount,
  isLoading,
  error,
  currentPage,
  pageSize,
  filters,
  onNextPage,
  onPrevPage,
  onPageSizeChange
}: SearchResultsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ResultsInfo 
          articlesCount={articles?.length || 0}
          totalCount={totalCount || 0}
          isLoading={isLoading}
          hasError={!!error}
          currentFilters={{
            showReviewsOnly: filters.showReviewsOnly,
            excludeReviews: filters.excludeReviews
          }}
        />
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
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
