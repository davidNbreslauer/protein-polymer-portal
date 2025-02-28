
export interface FilterOptions {
  proteinFamily: string[];
  proteinType?: string[];
  proteinCategory?: string[];
  proteinSubcategory?: string[];
  showBookmarksOnly?: boolean;
  sortDirection?: 'asc' | 'desc';
  showReviewsOnly?: boolean;
  excludeReviews?: boolean;
}

export interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}
