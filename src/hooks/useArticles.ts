
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";
import { useBookmarks } from "./useBookmarks";

interface FilterOptions {
  proteinFamily?: string[];
  showBookmarksOnly?: boolean;
}

const ARTICLES_PER_PAGE = 10;

const fetchArticles = async (searchQuery: string = '', filters: FilterOptions = {}, page: number = 0, bookmarkedPmids: string[] = []) => {
  try {
    // If showing bookmarks only and there are no bookmarks, return empty result
    if (filters.showBookmarksOnly && (!bookmarkedPmids || bookmarkedPmids.length === 0)) {
      return { articles: [], totalCount: 0 };
    }

    let totalCount = 0;
    
    // Handle count based on filter conditions
    if (filters.showBookmarksOnly) {
      const { count, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .in('pmid', bookmarkedPmids)
        .or(searchQuery ? `title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%` : 'title.neq.dummy');
      
      if (countError) throw countError;
      totalCount = count || 0;
    } else {
      const { data: countData, error: countError } = await supabase
        .rpc('count_filtered_articles', { search_query: searchQuery });
      
      if (countError) throw countError;
      totalCount = countData || 0;
    }

    // Start building the main query
    let query = supabase
      .from('articles')
      .select(`
        pmid,
        title,
        abstract,
        authors,
        timestamp,
        summary,
        conclusions
      `);

    // Apply bookmarks filter first if requested
    if (filters.showBookmarksOnly) {
      query = query.in('pmid', bookmarkedPmids);
    }

    // Apply text search filter if present
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`);
    }

    // Apply sorting and pagination
    query = query
      .order('timestamp', { ascending: false })
      .range(page * ARTICLES_PER_PAGE, (page + 1) * ARTICLES_PER_PAGE - 1);

    // Get the base articles
    const { data: baseArticles, error: baseError } = await query;
    
    if (baseError) throw baseError;
    if (!baseArticles) return { articles: [], totalCount: 0 };

    // Then fetch related data for these articles
    const articlePromises = baseArticles.map(async (article) => {
      const [proteinsResult, materialsResult, facetsResult] = await Promise.all([
        supabase
          .from('proteins')
          .select('name, description, type, derived_from, production_method')
          .eq('article_pmid', article.pmid),
        supabase
          .from('materials')
          .select('name, description, properties, key_properties')
          .eq('article_pmid', article.pmid),
        supabase
          .from('facets')
          .select('protein_family')
          .eq('article_pmid', article.pmid)
      ]);

      // Parse production_method string if it's in bracketed list format
      const proteins = proteinsResult.data?.map(protein => ({
        ...protein,
        production_method: protein.production_method 
          ? protein.production_method.replace(/[\[\]']/g, '').split(',').map(m => m.trim())
          : undefined
      })) || [];

      return {
        ...article,
        proteins,
        materials: materialsResult.data || [],
        facets: facetsResult.data || []
      };
    });

    let enrichedArticles = await Promise.all(articlePromises);

    // Apply protein family filter if present
    if (filters.proteinFamily?.length) {
      enrichedArticles = enrichedArticles.filter(article => 
        article.facets.some(facet => 
          facet.protein_family?.some(family => 
            filters.proteinFamily?.includes(family)
          )
        )
      );
    }

    return {
      articles: enrichedArticles as Article[],
      totalCount
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const useArticles = (searchQuery: string, filters: FilterOptions = {}, page: number = 0) => {
  const { bookmarkedPmids } = useBookmarks();

  return useQuery({
    queryKey: ['articles', searchQuery, filters, page, bookmarkedPmids],
    queryFn: () => fetchArticles(searchQuery, filters, page, bookmarkedPmids),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 10000),
  });
};
