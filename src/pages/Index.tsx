
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ArticleCard } from "@/components/ArticleCard";
import { useArticles } from "@/hooks/useArticles";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ 
    proteinFamily: [] as string[], 
    proteinType: [] as string[],
    proteinCategory: [] as string[],
    proteinSubcategory: [] as string[],
    showBookmarksOnly: false,
    sortDirection: 'desc' as 'asc' | 'desc',
    showReviewsOnly: false,
    excludeReviews: false
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const { data, isLoading, error } = useArticles(searchQuery, filters, currentPage, pageSize);
  const articles = data?.articles || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleFilterChange = (newFilters: { 
    proteinFamily: string[], 
    proteinType?: string[],
    proteinCategory?: string[],
    proteinSubcategory?: string[],
    showBookmarksOnly?: boolean,
    sortDirection?: 'asc' | 'desc',
    showReviewsOnly?: boolean,
    excludeReviews?: boolean
  }) => {
    setFilters(prev => ({
      ...prev,
      proteinFamily: newFilters.proteinFamily,
      proteinType: newFilters.proteinType ?? prev.proteinType,
      proteinCategory: newFilters.proteinCategory ?? prev.proteinCategory,
      proteinSubcategory: newFilters.proteinSubcategory ?? prev.proteinSubcategory,
      showBookmarksOnly: newFilters.showBookmarksOnly ?? prev.showBookmarksOnly,
      sortDirection: newFilters.sortDirection ?? prev.sortDirection,
      showReviewsOnly: newFilters.showReviewsOnly ?? prev.showReviewsOnly,
      excludeReviews: newFilters.excludeReviews ?? prev.excludeReviews
    }));
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleClearFilter = (type: 'category' | 'subcategory', value: string) => {
    if (type === 'category') {
      // When clearing a category, also clear its subcategories
      const categoryToRemove = value;
      // Find all subcategories that belong to this category to remove them
      const categoryIndex = value.indexOf('. ');
      const categoryName = categoryIndex !== -1 ? value.substring(categoryIndex + 2) : value;
      
      setFilters(prev => ({
        ...prev,
        proteinCategory: prev.proteinCategory.filter(c => !c.includes(categoryName)),
        // Remove subcategories that start with the category name
        proteinSubcategory: prev.proteinSubcategory.filter(sc => !sc.startsWith(`${categoryName}: `))
      }));
    } else {
      // Just remove the specific subcategory
      setFilters(prev => ({
        ...prev,
        proteinSubcategory: prev.proteinSubcategory.filter(sc => sc !== value)
      }));
    }
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (articles && articles.length === pageSize) { // If we have a full page, there might be more
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  // Format active filters for display
  const renderActiveFilters = () => {
    const activeFilters = [
      ...filters.proteinCategory.map(cat => {
        // Find the index if it starts with a number
        const categoryIndex = cat.indexOf('. ');
        const displayName = categoryIndex !== -1 ? cat : cat;
        return { type: 'category' as const, value: cat, display: displayName };
      }),
      ...filters.proteinSubcategory.map(sub => ({ type: 'subcategory' as const, value: sub, display: sub }))
    ];

    if (activeFilters.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Active Filters</h3>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <button
              key={`${filter.type}-${index}`}
              onClick={() => handleClearFilter(filter.type, filter.value)}
              className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm"
            >
              {filter.display}
              <X className="ml-1 w-4 h-4" />
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button 
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  proteinCategory: [],
                  proteinSubcategory: []
                }));
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    );
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
            {renderActiveFilters()}
            
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

            <div className="flex justify-between items-center">
              {!isLoading && !error && (
                <div className="text-sm text-gray-500">
                  {articles.length === 0 ? (
                    "No articles found matching your criteria."
                  ) : (
                    `Showing ${articles.length} article${articles.length === 1 ? '' : 's'} of ${totalCount} total result${totalCount === 1 ? '' : 's'}`
                  )}
                </div>
              )}

              <Select onValueChange={handlePageSizeChange} value={pageSize.toString()}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} results per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {articles?.map((article) => (
              <ArticleCard key={article.id} article={article} />
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
                  disabled={articles.length < pageSize || (currentPage + 1) * pageSize >= totalCount}
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
