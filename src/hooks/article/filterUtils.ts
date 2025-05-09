import { supabase } from "@/integrations/supabase/client";
import { FilterOptions, ProteinTypeFilterResult } from "./types";

// Apply search filter across multiple fields
export const applySearchFilter = (query: any, searchQuery: string) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return query;
  }

  const sanitizedQuery = searchQuery.trim();
  console.log('Applying search filter with query:', sanitizedQuery);
  
  // Only use basic text fields to avoid SQL parsing errors
  const textFields = [
    'title',
    'abstract',
    'authors', 
    'journal',
    'summary',
    'conclusions',
    'publication_type',
    'language'
  ];
  
  // Build a more reliable filter using OR conditions for text fields
  let conditions = textFields.map(field => 
    `${field}.ilike.%${sanitizedQuery}%`
  );
  
  // Use explicit or() method with spread operator to apply all conditions
  return query.or(conditions.join(','));
};

// Apply date range filters
export const applyDateFilters = (query: any, startDate?: Date | null, endDate?: Date | null) => {
  let updatedQuery = query;
  
  if (startDate) {
    const startDateStr = startDate.toISOString().split('T')[0];
    updatedQuery = updatedQuery.gte('pub_date', startDateStr);
  }
  
  if (endDate) {
    const endDate_ = new Date(endDate);
    endDate_.setDate(endDate_.getDate() + 1);
    const endDateStr = endDate_.toISOString().split('T')[0];
    updatedQuery = updatedQuery.lt('pub_date', endDateStr);
  }
  
  return updatedQuery;
};

// Apply view filters (reviews only/exclude reviews)
export const applyViewFilters = (query: any, filters: { showReviewsOnly?: boolean, excludeReviews?: boolean }) => {
  let updatedQuery = query;
  
  if (filters.showReviewsOnly) {
    updatedQuery = updatedQuery.ilike('publication_type', '%review%');
  } else if (filters.excludeReviews) {
    updatedQuery = updatedQuery.not('publication_type', 'ilike', '%review%');
  }
  
  return updatedQuery;
};

// Process protein type filters and retrieve filtered article IDs
export const getProteinTypeFilteredIds = async (filters: FilterOptions): Promise<ProteinTypeFilterResult> => {
  if (!filters.proteinType?.length) {
    return { filteredArticleIds: [], shouldReturn: false };
  }
  
  try {
    const { data: proteinData, error } = await supabase
      .from('proteins')
      .select('article_id')
      .in('type', filters.proteinType);
    
    if (error) {
      console.error('Error fetching protein type data:', error);
      throw new Error(error.message || 'Failed to fetch protein types');
    }
    
    const filteredArticleIds = (proteinData || []).map(item => item.article_id);
    
    // If no articles match the protein type filter, return early
    if (filteredArticleIds.length === 0) {
      return { filteredArticleIds: [], shouldReturn: true };
    }
    
    return { filteredArticleIds, shouldReturn: false };
  } catch (error) {
    console.error('Error in getProteinTypeFilteredIds:', error);
    throw error;
  }
};

// Apply protein category/subcategory filters
export const applyProteinFilters = (query: any, filters: FilterOptions, filteredArticleIds: number[] = []) => {
  let updatedQuery = query;
  
  // Apply article ID filter if we have filtered IDs from protein type
  if (filteredArticleIds.length > 0) {
    updatedQuery = updatedQuery.in('id', filteredArticleIds);
  }

  // Apply protein category/subcategory filters
  if (filters.proteinCategory?.length) {
    updatedQuery = updatedQuery.overlaps('facets_protein_categories', filters.proteinCategory);
  }

  if (filters.proteinSubcategory?.length) {
    updatedQuery = updatedQuery.overlaps('facets_protein_subcategories', filters.proteinSubcategory);
  }
  
  return updatedQuery;
};

// Apply bookmark filter
export const applyBookmarkFilter = (query: any, showBookmarksOnly: boolean, bookmarkedArticleIds: number[] = []) => {
  if (showBookmarksOnly) {
    return query.in('id', bookmarkedArticleIds);
  }
  return query;
};
