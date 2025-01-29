
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ArticleCard } from "@/components/ArticleCard";
import { useArticles } from "@/hooks/useArticles";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: articles, isLoading, error } = useArticles(searchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={handleSearch} />

      <main className="pt-36 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Sidebar />

          <div className="md:col-span-3 space-y-4">
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
                <p className="text-gray-500">No articles found matching your search criteria.</p>
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
