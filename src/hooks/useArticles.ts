
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";
import { useBookmarks } from "./useBookmarks";

interface FilterOptions {
  proteinFamily?: string[];
  showBookmarksOnly?: boolean;
}

const ARTICLES_PER_PAGE = 10;

const fetchArticles = async (searchQuery: string = '', filters: FilterOptions = {}, page: number = 0, bookmarkedArticleIds: number[] = []) => {
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
        .or(searchQuery ? `title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%` : 'title.neq.dummy');
      
      if (countError) throw countError;
      totalCount = count || 0;
    } else {
      const { data: countData, error: countError } = await supabase
        .rpc('count_filtered_articles', { search_query: searchQuery });
      
      if (countError) throw countError;
      totalCount = countData || 0;
    }

    // Start building the query for articles with all fields
    let query = supabase
      .from('articles')
      .select(`
        *,
        proteins (
          id,
          name,
          description,
          type,
          derived_from,
          production_method,
          role_in_study,
          key_properties,
          applications,
          structural_motifs,
          protein_family,
          protein_form,
          expression_system
        ),
        materials (
          id,
          name,
          description,
          composition,
          fabrication_method,
          key_properties,
          potential_applications
        ),
        methods (
          id,
          method_name
        ),
        analysis_techniques (
          id,
          technique
        ),
        results (
          id,
          description,
          data
        )
      `);

    // Apply bookmarks filter if requested
    if (filters.showBookmarksOnly) {
      query = query.in('id', bookmarkedArticleIds);
    }

    // Apply text search filter if present
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`);
    }

    // Apply sorting and pagination
    query = query
      .order('created_at', { ascending: false })
      .range(page * ARTICLES_PER_PAGE, (page + 1) * ARTICLES_PER_PAGE - 1);

    // Execute the query
    const { data: articles, error } = await query;
    
    if (error) throw error;
    if (!articles) return { articles: [], totalCount: 0 };

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
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const useArticles = (searchQuery: string, filters: FilterOptions = {}, page: number = 0) => {
  const { bookmarkedArticleIds } = useBookmarks();

  return useQuery({
    queryKey: ['articles', searchQuery, filters, page, bookmarkedArticleIds],
    queryFn: () => fetchArticles(searchQuery, filters, page, bookmarkedArticleIds),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 10000),
  });
};
