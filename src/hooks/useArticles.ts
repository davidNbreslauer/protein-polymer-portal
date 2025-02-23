
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
    
    // Handle count based on filter conditions
    if (filters.showBookmarksOnly) {
      const { count, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .in('id', bookmarkedArticleIds)
        .or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,authors.ilike.%${searchQuery}%,journal.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,conclusions.ilike.%${searchQuery}%,publication_type.ilike.%${searchQuery}%,language.ilike.%${searchQuery}%`);
      
      if (countError) throw countError;
      totalCount = count || 0;
    } else {
      const { data: countData, error: countError } = await supabase
        .rpc('count_filtered_articles', { search_query: searchQuery });
      
      if (countError) throw countError;
      totalCount = countData || 0;
    }

    // Build the query with proper foreign table syntax
    let query = supabase
      .from('articles')
      .select(`
        *,
        proteins!inner (
          id,
          name,
          type
        )
      `);

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

    // Filter by protein type if specified
    if (filters.proteinType?.length) {
      query = query.filter('proteins.type', 'in', `(${filters.proteinType.join(',')})`);
    }

    // Apply text search filter across all relevant fields
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,authors.ilike.%${searchQuery}%,journal.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,conclusions.ilike.%${searchQuery}%,publication_type.ilike.%${searchQuery}%,language.ilike.%${searchQuery}%`);
    }

    // Apply sorting (default to descending if not specified)
    query = query.order('pub_date', { ascending: filters.sortDirection === 'asc' });

    // Apply pagination with dynamic page size
    query = query.range(page * pageSize, (page + 1) * pageSize - 1);

    console.log('Fetching articles with protein types:', filters.proteinType);

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

    console.log('Fetched articles count:', articles.length);

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
