
export interface FilterOptions {
  proteinFamily: string[];
  proteinType?: string[];
  proteinCategory?: string[];
  proteinSubcategory?: string[];
  showBookmarksOnly?: boolean;
  sortDirection?: 'asc' | 'desc';
  showReviewsOnly?: boolean;
  excludeReviews?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}
