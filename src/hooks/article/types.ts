
import type { Article } from "@/types/article";

export interface FilterOptions {
  proteinFamily?: string[];
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

export interface ArticlesResponse {
  articles: Article[];
  totalCount: number;
}
