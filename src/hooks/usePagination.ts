
import { useState } from "react";

export function usePagination() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleNextPage = (itemsCount: number) => {
    if (itemsCount === pageSize) { // If we have a full page, there might be more
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

  const resetPage = () => {
    setCurrentPage(0);
  };

  return {
    currentPage,
    pageSize,
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
    resetPage
  };
}
