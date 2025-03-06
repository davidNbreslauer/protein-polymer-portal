
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
    
    // Build base count query
    let countQuery = supabase.from('articles')
      .select('id', { count: 'exact', head: true });
      
    // Apply filters to count query
    countQuery = applyProteinFilters(countQuery, filters, filteredArticleIds);
    countQuery = applyBookmarkFilter(countQuery, !!filters.showBookmarksOnly, bookmarkedArticleIds);
    countQuery = applyViewFilters(countQuery, filters);
    countQuery = applyDateFilters(countQuery, filters.startDate, filters.endDate);
    
    // Apply search if specified
    if (searchQuery && searchQuery.trim() !== '') {
      try {
        countQuery = applySearchFilter(countQuery, searchQuery.trim());
        const { count, error: countError } = await countQuery;
        
        if (!countError) {
          totalCount = count || 0;
          console.log('Total count of matching articles:', totalCount);
        } else {
          console.error('Error getting count:', countError);
          totalCount = 0;
        }
      } catch (error) {
        console.error('Error in search filter count:', error);
        totalCount = 0;
      }
    } else {
      // Get count without search
      const { count, error: countError } = await countQuery;
      if (!countError) {
        totalCount = count || 0;
      } else {
        console.error('Error getting basic count:', countError);
        totalCount = 0;
      }
    }

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

    // Apply search if specified
    if (searchQuery && searchQuery.trim() !== '') {
      try {
        query = applySearchFilter(query, searchQuery.trim());
      } catch (error) {
        console.error('Error applying search filter:', error);
        throw new Error('Search query contains invalid characters. Please try a simpler search term.');
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
    
    console.log(`Retrieved ${articles?.length || 0} articles`);
    
    // Return the final results
    return {
      articles: articles as Article[] || [],
      totalCount
    };
  } catch (error) {
    console.error('Error in fetchArticles:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to fetch articles. Please try again later.');
    }
  }
};
