
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";
import { useBookmarks } from "./useBookmarks";

interface FilterOptions {
  proteinFamily?: string[];
  proteinType?: string[];
  showBookmarksOnly?: boolean;
  sortDirection?: 'asc' | 'desc';
  showReviewsOnly?: boolean;
  excludeReviews?: boolean;
}

const fetchArticles = async (searchQuery: string = '', filters: FilterOptions = {}, page: number = 0, pageSize: number = 10, bookmarkedArticleIds: number[] = []) => {
  try {
    // If showing bookmarks only and there are no bookmarks, return empty result
    if (filters.showBookmarksOnly && (!bookmarkedArticleIds || bookmarkedArticleIds.length === 0)) {
      return { articles: [], totalCount: 0 };
    }

    let totalCount = 0;
    
    // First, if we have protein type filters, get the matching article IDs
    let filteredArticleIds: number[] = [];
    if (filters.proteinType?.length) {
      const { data: proteinData } = await supabase
        .from('proteins')
        .select('article_id')
        .in('type', filters.proteinType);
      
      filteredArticleIds = (proteinData || []).map(item => item.article_id);
      
      // If no articles match the protein type filter, return empty result
      if (filteredArticleIds.length === 0) {
        return { articles: [], totalCount: 0 };
      }
    }
    
    // Handle count based on filter conditions
    let countQuery = supabase.from('articles')
      .select('*', { count: 'exact', head: true });

    // Apply protein type filter to count query if specified
    if (filteredArticleIds.length > 0) {
      countQuery = countQuery.in('id', filteredArticleIds);
    }

    if (filters.showBookmarksOnly) {
      countQuery = countQuery.in('id', bookmarkedArticleIds);
    }

    if (searchQuery) {
      countQuery = countQuery.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,authors.ilike.%${searchQuery}%,journal.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,conclusions.ilike.%${searchQuery}%,publication_type.ilike.%${searchQuery}%,language.ilike.%${searchQuery}%`);
    }

    const { count, error: countError } = await countQuery;
    
    if (countError) throw countError;
    totalCount = count || 0;

    // Build the main query with proper foreign table syntax
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

    // Apply protein type filter if specified
    if (filteredArticleIds.length > 0) {
      query = query.in('id', filteredArticleIds);
    }

    // Apply bookmarks filter if requested
    if (filters.showBookmarksOnly) {
      query = query.in('id', bookmarkedArticleIds);
    }

    // Apply reviews filter if requested
    if (filters.showReviewsOnly) {
      query = query.ilike('publication_type', '%review%');
    } else if (filters.excludeReviews) {
      query = query.not('publication_type', 'ilike', '%review%');
    }

    // Apply text search filter across all relevant fields
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,authors.ilike.%${searchQuery}%,journal.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,conclusions.ilike.%${searchQuery}%,publication_type.ilike.%${searchQuery}%,language.ilike.%${searchQuery}%`);
    }

    // Apply sorting (default to descending if not specified)
    query = query.order('pub_date', { ascending: filters.sortDirection === 'asc' });

    // Apply pagination with dynamic page size
    query = query.range(page * pageSize, (page + 1) * pageSize - 1);

    console.log('Fetching articles with query:', query);

    // Execute the query
    const { data: articles, error } = await query;
    
    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    
    if (!articles) {
      console.log('No articles found');
      return { articles: [], totalCount: 0 };
    }

    console.log('Fetched articles:', articles);

    // Filter by protein family if specified
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
    throw error;
  }
};

export const useArticles = (searchQuery: string, filters: FilterOptions = {}, page: number = 0, pageSize: number = 10) => {
  const { bookmarkedArticleIds } = useBookmarks();

  return useQuery({
    queryKey: ['articles', searchQuery, filters, page, pageSize, bookmarkedArticleIds],
    queryFn: () => fetchArticles(searchQuery, filters, page, pageSize, bookmarkedArticleIds),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 10000),
  });
};
