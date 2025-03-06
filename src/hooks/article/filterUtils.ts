
// Filter utility functions for article queries

// Apply search filter across multiple fields
export const applySearchFilter = (query: any, searchQuery: string) => {
  return query.or(
    `title.ilike.%${searchQuery}%,` +
    `abstract.ilike.%${searchQuery}%,` +
    `authors.ilike.%${searchQuery}%,` +
    `journal.ilike.%${searchQuery}%,` +
    `summary.ilike.%${searchQuery}%,` + 
    `conclusions.ilike.%${searchQuery}%,` +
    `publication_type.ilike.%${searchQuery}%,` +
    `language.ilike.%${searchQuery}%,` +
    `facets_protein_family.ilike.%${searchQuery}%,` +
    `facets_protein_form.ilike.%${searchQuery}%,` +
    `facets_expression_system.ilike.%${searchQuery}%,` +
    `facets_application.ilike.%${searchQuery}%,` +
    `facets_structural_motifs.ilike.%${searchQuery}%,` +
    `facets_tested_properties.ilike.%${searchQuery}%,` +
    `facets_protein_categories.ilike.%${searchQuery}%,` +
    `facets_protein_subcategories.ilike.%${searchQuery}%`
  );
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
