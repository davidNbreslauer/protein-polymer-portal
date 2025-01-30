
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";

interface FilterOptions {
  proteinFamily?: string[];
}

const ARTICLES_PER_PAGE = 10;

const fetchArticles = async (searchQuery: string = '', filters: FilterOptions = {}, page: number = 0) => {
  try {
    // Fetch total count first
    const { data: countData, error: countError } = await supabase
      .rpc('count_filtered_articles', { search_query: searchQuery });
    
    if (countError) throw countError;
    const totalCount = countData || 0;

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
      `)
      .order('timestamp', { ascending: false })
      .range(page * ARTICLES_PER_PAGE, (page + 1) * ARTICLES_PER_PAGE - 1);

    // Apply text search filter if present
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`.split(','));
    }

    // Get the base articles first
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
          .select('name, description')
          .eq('article_pmid', article.pmid),
        supabase
          .from('facets')
          .select('protein_family')
          .eq('article_pmid', article.pmid)
      ]);

      return {
        ...article,
        proteins: proteinsResult.data || [],
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
  return useQuery({
    queryKey: ['articles', searchQuery, filters, page],
    queryFn: () => fetchArticles(searchQuery, filters, page),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 10000),
  });
};
