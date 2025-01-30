
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ArticleCard } from "@/components/ArticleCard";
import { useArticles } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ proteinFamily: [] as string[] });
  const [currentPage, setCurrentPage] = useState(0);
  
  const { data, isLoading, error } = useArticles(searchQuery, filters, currentPage);
  const articles = data?.articles || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 10);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleFilterChange = (newFilters: { proteinFamily: string[] }) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleNextPage = () => {
    if (articles && articles.length === 10) { // If we have a full page, there might be more
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={handleSearch} />

      <main className="pt-[180px] pb-8 px-4 max-w-7xl mx-auto">
        <div className="flex gap-6">
          <div className="pt-4">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>

          <div className="flex-1 space-y-4 pt-4">
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading articles...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                Error loading articles. Please try again later.
              </div>
            )}

            {!isLoading && !error && (
              <div className="text-sm text-gray-500 mb-4">
                {articles.length === 0 ? (
                  "No articles found matching your criteria."
                ) : (
                  `Showing ${articles.length} article${articles.length === 1 ? '' : 's'} of ${totalCount} total result${totalCount === 1 ? '' : 's'}`
                )}
              </div>
            )}

            {articles?.map((article) => (
              <ArticleCard key={article.pmid} article={article} />
            ))}

            {articles && articles.length > 0 && (
              <div className="flex justify-between items-center pt-6">
                <Button 
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-gray-500">
                  Page {currentPage + 1} of {totalPages}
                </span>

                <Button 
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={articles.length < 10 || (currentPage + 1) * 10 >= totalCount}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
