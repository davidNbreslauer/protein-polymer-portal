
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
    
    // Build count query to get total number of results
    let countQuery = supabase.from('articles')
      .select('id', { count: 'exact', head: true });

    // Apply filters to count query
    countQuery = applyProteinFilters(countQuery, filters, filteredArticleIds);
    countQuery = applyBookmarkFilter(countQuery, !!filters.showBookmarksOnly, bookmarkedArticleIds);
    countQuery = applyViewFilters(countQuery, filters);

    // Apply search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      try {
        countQuery = applySearchFilter(countQuery, searchQuery.trim());
      } catch (error) {
        console.error('Error applying search filter to count query:', error);
        throw new Error('Invalid search query. Please try a different search term.');
      }
    }

    // Apply date filters if provided
    countQuery = applyDateFilters(countQuery, filters.startDate, filters.endDate);

    // Get total count of matching articles
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Error getting count:', countError);
      throw new Error(countError.message || 'Failed to count matching articles');
    }
    
    totalCount = count || 0;
    console.log('Total count of articles:', totalCount);

    // If no articles match our criteria, return early
    if (totalCount === 0) {
      return { articles: [], totalCount: 0 };
    }

    // Build main query to fetch the actual articles with related data
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

    // Apply same filters to main query as we did to count query
    query = applyProteinFilters(query, filters, filteredArticleIds);
    query = applyBookmarkFilter(query, !!filters.showBookmarksOnly, bookmarkedArticleIds);
    query = applyViewFilters(query, filters);

    // Apply search query if provided
    if (searchQuery && searchQuery.trim() !== '') {
      try {
        query = applySearchFilter(query, searchQuery.trim());
      } catch (error) {
        console.error('Error applying search filter to main query:', error);
        throw new Error('Invalid search query. Please try a different search term.');
      }
    }

    // Apply date filters if provided
    query = applyDateFilters(query, filters.startDate, filters.endDate);

    // Apply sorting
    query = query.order('pub_date', { ascending: filters.sortDirection === 'asc' });

    // Apply pagination
    query = query.range(page * pageSize, (page + 1) * pageSize - 1);

    // Execute main query
    const { data: articles, error } = await query;
    
    if (error) {
      console.error('Error fetching articles:', error);
      throw new Error(error.message || 'Failed to fetch articles');
    }
    
    if (!articles || articles.length === 0) {
      console.log('No articles found for query:', searchQuery, 'with filters:', filters);
      return { articles: [], totalCount };
    }

    console.log(`Retrieved ${articles.length} articles`);

    // Additional filtering for protein family if specified
    let filteredArticles = articles;
    
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
    console.error('Error in fetchArticles:', error);
    // Ensure we're always throwing an Error object with a message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to fetch articles. Please try again later.');
    }
  }
};
