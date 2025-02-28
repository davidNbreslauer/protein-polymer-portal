
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  articlesCount: number;
  totalCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  articlesCount, 
  totalCount,
  onPrevPage, 
  onNextPage 
}: PaginationProps) => {
  if (articlesCount === 0) return null;
  
  return (
    <div className="flex justify-between items-center pt-6">
      <Button 
        variant="outline"
        onClick={onPrevPage}
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
        onClick={onNextPage}
        disabled={articlesCount < pageSize || (currentPage + 1) * pageSize >= totalCount}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
