
import { supabase } from "@/integrations/supabase/client";
import { FilterOptions, ProteinTypeFilterResult } from "./types";

// Apply search filter across multiple fields
export const applySearchFilter = (query: any, searchQuery: string) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return query;
  }

  const sanitizedQuery = searchQuery.trim();
  console.log('Applying search filter with query:', sanitizedQuery);
  
  // Add array fields with special handling
  const arrayFields = [
    'facets_protein_family',
    'facets_protein_form',
    'facets_expression_system',
    'facets_application',
    'facets_structural_motifs',
    'facets_tested_properties',
    'facets_protein_categories',
    'facets_protein_subcategories'
  ];
  
  // Build the OR condition for text fields (non-array fields)
  const textFieldsCondition = 
    `title.ilike.%${sanitizedQuery}%,` +
    `abstract.ilike.%${sanitizedQuery}%,` +
    `authors.ilike.%${sanitizedQuery}%,` +
    `journal.ilike.%${sanitizedQuery}%,` +
    `summary.ilike.%${sanitizedQuery}%,` + 
    `conclusions.ilike.%${sanitizedQuery}%,` +
    `publication_type.ilike.%${sanitizedQuery}%,` +
    `language.ilike.%${sanitizedQuery}%`;
  
  // First apply the filter for regular text fields
  let filteredQuery = query.or(textFieldsCondition);
  
  // For array fields, we need a different approach
  for (const field of arrayFields) {
    // Check if any array element contains the search string
    filteredQuery = filteredQuery.or(`${field}::text.ilike.%${sanitizedQuery}%`);
  }
  
  return filteredQuery;
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
  
  const { data: proteinData, error } = await supabase
    .from('proteins')
    .select('article_id')
    .in('type', filters.proteinType);
  
  if (error) {
    console.error('Error fetching protein type data:', error);
    throw error;
  }
  
  const filteredArticleIds = (proteinData || []).map(item => item.article_id);
  
  // If no articles match the protein type filter, return early
  if (filteredArticleIds.length === 0) {
    return { filteredArticleIds: [], shouldReturn: true };
  }
  
  return { filteredArticleIds, shouldReturn: false };
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
