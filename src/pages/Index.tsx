
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ArticleCard } from "@/components/ArticleCard";
import { useArticles } from "@/hooks/useArticles";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ proteinFamily: [] as string[] });
  
  const { data: articles, isLoading, error } = useArticles(searchQuery, filters);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilters: { proteinFamily: string[] }) => {
    setFilters(newFilters);
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

            {articles?.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500">No articles found matching your criteria.</p>
              </div>
            )}

            {articles?.map((article) => (
              <ArticleCard key={article.pmid} article={article} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
