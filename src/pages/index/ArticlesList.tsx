
import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/types/article";
import { Pagination } from "./Pagination";
import { AlertTriangle } from "lucide-react";

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
  // Log the articles we're receiving for debugging
  console.log('ArticlesList received articles:', articles?.length, 'isLoading:', isLoading, 'error:', error);
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    console.error('Error in ArticlesList:', error);
    let errorMessage = 'Unknown error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Check for specific SQL parsing errors and provide clearer message
    if (errorMessage.includes('parse logic tree') || errorMessage.includes('syntax error')) {
      errorMessage = 'Your search contains characters that cannot be processed. Please try a simpler search term.';
    }
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-800 font-medium">Error loading articles</h3>
          <p className="text-red-600 text-sm mt-1">
            Please try again later or refine your search criteria.
          </p>
          <p className="text-xs mt-2 text-red-400">
            Technical details: {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No articles found matching your criteria.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms or filters.</p>
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
