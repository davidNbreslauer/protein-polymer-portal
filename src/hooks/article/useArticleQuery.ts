
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";
import { FilterOptions, ArticlesResponse } from "./types";
import { 
  applySearchFilter, 
  applyDateFilters, 
  applyViewFilters,
  getProteinTypeFilteredIds,
  applyProteinFilters,
  applyBookmarkFilter
} from "./filterUtils";

export const fetchArticles = async (
  searchQuery: string = '', 
  filters: FilterOptions = {}, 
  page: number = 0, 
  pageSize: number = 10, 
  bookmarkedArticleIds: number[] = []
): Promise<ArticlesResponse> => {
  try {
    if (filters.showBookmarksOnly && (!bookmarkedArticleIds || bookmarkedArticleIds.length === 0)) {
      return { articles: [], totalCount: 0 };
    }

    let totalCount = 0;
    
    console.log('Fetching articles with filters:', JSON.stringify(filters, null, 2));
    console.log('Search query:', searchQuery);
    
    // Get filtered article IDs based on protein type if specified
    const { filteredArticleIds, shouldReturn } = await getProteinTypeFilteredIds(filters);
    
    if (shouldReturn) {
      return { articles: [], totalCount: 0 };
    }
    
    // For search queries, first try to retrieve a pre-counted result if available
    if (searchQuery && searchQuery.trim() !== '') {
      try {
        // Use our basic text search first to see how many results we'd get
        let countQuery = supabase.from('articles')
          .select('id', { count: 'exact', head: true });

        // Apply filters
        countQuery = applyProteinFilters(countQuery, filters, filteredArticleIds);
        countQuery = applyBookmarkFilter(countQuery, !!filters.showBookmarksOnly, bookmarkedArticleIds);
        countQuery = applyViewFilters(countQuery, filters);
        countQuery = applyDateFilters(countQuery, filters.startDate, filters.endDate);

        // Apply basic search on text fields
        try {
          countQuery = applySearchFilter(countQuery, searchQuery.trim());
          const { count, error: countError } = await countQuery;
          
          if (!countError) {
            totalCount = count || 0;
            console.log('Total count of matching articles:', totalCount);
          } else {
            console.error('Error getting count:', countError);
            // We'll try an alternative search approach instead of throwing
          }
        } catch (error) {
          console.error('Error in search filter count:', error);
          // Continue with fallback approach
        }
      } catch (error) {
        console.error('Error counting articles:', error);
        // Continue with fallback
      }
    }

    // If we haven't set totalCount yet, try a basic count without search filters
    if (totalCount === 0) {
      try {
        let basicCountQuery = supabase.from('articles')
          .select('id', { count: 'exact', head: true });
        
        // Apply non-search filters
        basicCountQuery = applyProteinFilters(basicCountQuery, filters, filteredArticleIds);
        basicCountQuery = applyBookmarkFilter(basicCountQuery, !!filters.showBookmarksOnly, bookmarkedArticleIds);
        basicCountQuery = applyViewFilters(basicCountQuery, filters);
        basicCountQuery = applyDateFilters(basicCountQuery, filters.startDate, filters.endDate);
        
        const { count, error: basicCountError } = await basicCountQuery;
        
        if (!basicCountError) {
          totalCount = count || 0;
          console.log('Basic count of matching articles:', totalCount);
        } else {
          console.error('Error getting basic count:', basicCountError);
        }
      } catch (error) {
        console.error('Error in basic count:', error);
      }
    }

    // If no articles match our criteria, return early
    if (totalCount === 0) {
      return { articles: [], totalCount: 0 };
    }

    try {
      // Build main query to fetch articles
      let query = supabase
        .from('articles')
        .select(`
          *,
          proteins(*),
          materials(*),
          methods(*),
          analysis_techniques(*),
          results(*)
        `);

      // Apply non-search filters
      query = applyProteinFilters(query, filters, filteredArticleIds);
      query = applyBookmarkFilter(query, !!filters.showBookmarksOnly, bookmarkedArticleIds);
      query = applyViewFilters(query, filters);
      query = applyDateFilters(query, filters.startDate, filters.endDate);

      // Apply search if specified - with error handling
      if (searchQuery && searchQuery.trim() !== '') {
        try {
          query = applySearchFilter(query, searchQuery.trim());
        } catch (error) {
          console.error('Error applying search filter:', error);
          // Return empty results rather than a broken query
          return { articles: [], totalCount: 0 };
        }
      }

      // Apply sorting
      query = query.order('pub_date', { ascending: filters.sortDirection === 'asc' });

      // Apply pagination
      query = query.range(page * pageSize, (page + 1) * pageSize - 1);

      // Execute main query
      const { data: articles, error } = await query;
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles: ' + (error.message || 'Unknown error'));
      }
      
      if (!articles || articles.length === 0) {
        console.log('No articles found for the query');
        return { articles: [], totalCount };
      }

      console.log(`Retrieved ${articles.length} articles`);

      // If we have a search query, perform additional in-memory filtering for array fields
      let filteredArticles = articles;
      
      if (searchQuery && searchQuery.trim() !== '') {
        const lowerSearchQuery = searchQuery.trim().toLowerCase();
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
        
        // Additional in-memory filtering for array fields
        filteredArticles = filteredArticles.filter(article => {
          // Check if any array field contains the search query
          return arrayFields.some(field => {
            const arrayValue = article[field];
            if (!arrayValue || !Array.isArray(arrayValue)) return false;
            
            // Search within the array items
            return arrayValue.some(item => {
              if (typeof item === 'string') {
                return item.toLowerCase().includes(lowerSearchQuery);
              }
              return false;
            });
          });
        });
      }

      // Handle protein family filter in memory if needed
      if (filters.proteinFamily?.length) {
        filteredArticles = filteredArticles.filter(article => 
          article.facets_protein_family?.some(family => 
            filters.proteinFamily?.includes(family)
          )
        );
      }

      return {
        articles: filteredArticles as Article[],
        totalCount
      };
    } catch (error) {
      console.error('Error in article query execution:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in fetchArticles:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to fetch articles. Please try again later.');
    }
  }
};
