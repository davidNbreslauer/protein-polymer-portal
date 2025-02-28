
import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/types/article";
import { Pagination } from "./Pagination";

interface ArticlesListProps {
  articles: Article[];
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const ArticlesList = ({ 
  articles, 
  isLoading, 
  error, 
  currentPage, 
  pageSize, 
  totalCount,
  onNextPage,
  onPrevPage
}: ArticlesListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Error loading articles. Please try again later.
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {articles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          articlesCount={articles.length}
          totalCount={totalCount}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
        />
      )}
    </div>
  );
};
