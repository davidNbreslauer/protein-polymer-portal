
import { useState } from "react";
import { Header } from "@/components/Header";
import { useArticles } from "@/hooks/useArticles";
import { useFilterState } from "@/hooks/useFilterState";
import { usePagination } from "@/hooks/usePagination";
import { FilterControls } from "./index/FilterControls";
import { SearchResults } from "./index/SearchResults";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    filters, 
    handleFilterChange, 
    handleClearFilter, 
    clearAllFilters 
  } = useFilterState();
  
  const {
    currentPage,
    pageSize,
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
    resetPage
  } = usePagination();
  
  const { data, isLoading, error } = useArticles(searchQuery, filters, currentPage, pageSize);
  const articles = data?.articles || [];
  const totalCount = data?.totalCount || 0;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    resetPage(); // Reset to first page on new search
  };

  const handleFilterChangeWithReset = (newFilters: any) => {
    handleFilterChange(newFilters);
    resetPage(); // Reset to first page on filter change
  };

  const handleClearFilterWithReset = (type: 'category' | 'subcategory' | 'proteinFamily' | 'proteinType' | 'date' | 'viewOption', value: string) => {
    handleClearFilter(type, value);
    resetPage(); // Reset to first page on filter change
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
    resetPage(); // Reset to first page on filter change
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={handleSearch} />

      <main className="pt-[180px] pb-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 shrink-0">
            <FilterControls 
              filters={filters}
              onFilterChange={handleFilterChangeWithReset}
              onClearFilter={handleClearFilterWithReset}
              onClearAll={handleClearAllFilters}
            />
          </div>
          
          <div className="flex-1">
            <SearchResults 
              articles={articles}
              totalCount={totalCount}
              isLoading={isLoading}
              error={error}
              currentPage={currentPage}
              pageSize={pageSize}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
