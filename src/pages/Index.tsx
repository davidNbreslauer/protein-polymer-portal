
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useArticles } from "@/hooks/useArticles";
import { ActiveFilters } from "./index/ActiveFilters";
import { ArticlesList } from "./index/ArticlesList";
import { PageSizeSelector } from "./index/PageSizeSelector";
import { ResultsInfo } from "./index/ResultsInfo";

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
    excludeReviews: false,
    startDate: null as Date | null,
    endDate: null as Date | null
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const { data, isLoading, error } = useArticles(searchQuery, filters, currentPage, pageSize);
  const articles = data?.articles || [];
  const totalCount = data?.totalCount || 0;

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
    excludeReviews?: boolean,
    startDate?: Date | null,
    endDate?: Date | null
  }) => {
    console.log("Filter change in Index component:", newFilters);
    
    setFilters(prev => ({
      ...prev,
      proteinFamily: newFilters.proteinFamily,
      proteinType: newFilters.proteinType ?? prev.proteinType,
      proteinCategory: newFilters.proteinCategory ?? prev.proteinCategory,
      proteinSubcategory: newFilters.proteinSubcategory ?? prev.proteinSubcategory,
      showBookmarksOnly: newFilters.showBookmarksOnly ?? prev.showBookmarksOnly,
      sortDirection: newFilters.sortDirection ?? prev.sortDirection,
      showReviewsOnly: newFilters.showReviewsOnly ?? prev.showReviewsOnly,
      excludeReviews: newFilters.excludeReviews ?? prev.excludeReviews,
      startDate: newFilters.startDate !== undefined ? newFilters.startDate : prev.startDate,
      endDate: newFilters.endDate !== undefined ? newFilters.endDate : prev.endDate
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

  const handleClearAllCategoryFilters = () => {
    setFilters(prev => ({
      ...prev,
      proteinCategory: [],
      proteinSubcategory: []
    }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={handleSearch} />

      <main className="pt-[180px] pb-8 px-4 max-w-7xl mx-auto">
        <div className="flex gap-6">
          <div className="pt-4">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>

          <div className="flex-1 space-y-4 pt-4">
            <ActiveFilters 
              proteinCategories={filters.proteinCategory}
              proteinSubcategories={filters.proteinSubcategory}
              onClearFilter={handleClearFilter}
              onClearAll={handleClearAllCategoryFilters}
            />
            
            <div className="flex justify-between items-center">
              <ResultsInfo 
                articlesCount={articles.length}
                totalCount={totalCount}
                isLoading={isLoading}
                hasError={!!error}
              />

              <PageSizeSelector
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>

            <ArticlesList
              articles={articles}
              isLoading={isLoading}
              error={error}
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
