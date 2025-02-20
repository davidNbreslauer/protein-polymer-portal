
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

    // Start building the main query
    let query = supabase
      .from('articles')
      .select(`
        id,
        pubmed_id,
        doi,
        title,
        abstract,
        authors,
        journal,
        volume,
        issue,
        pages,
        elocation_id,
        pub_date,
        language,
        publication_type,
        publication_status,
        summary,
        conclusions,
        facets_protein_family,
        facets_protein_form,
        facets_expression_system,
        facets_application,
        facets_structural_motifs,
        facets_tested_properties,
        created_at,
        updated_at
      `);

    // Apply bookmarks filter first if requested
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

    // Get the base articles
    const { data: baseArticles, error: baseError } = await query;
    
    if (baseError) throw baseError;
    if (!baseArticles) return { articles: [], totalCount: 0 };

    // Then fetch related data for these articles
    const articlePromises = baseArticles.map(async (article) => {
      const [proteinsResult, materialsResult, methodsResult, techniquesResult, resultsResult] = await Promise.all([
        supabase
          .from('proteins')
          .select('*')
          .eq('article_id', article.id),
        supabase
          .from('materials')
          .select('*')
          .eq('article_id', article.id),
        supabase
          .from('methods')
          .select('*')
          .eq('article_id', article.id),
        supabase
          .from('analysis_techniques')
          .select('*')
          .eq('article_id', article.id),
        supabase
          .from('results')
          .select('*')
          .eq('article_id', article.id)
      ]);

      return {
        ...article,
        proteins: proteinsResult.data || [],
        materials: materialsResult.data || [],
        methods: methodsResult.data || [],
        analysis_techniques: techniquesResult.data || [],
        results: resultsResult.data || []
      };
    });

    let enrichedArticles = await Promise.all(articlePromises);

    // Apply protein family filter if present
    if (filters.proteinFamily?.length) {
      enrichedArticles = enrichedArticles.filter(article => 
        article.facets_protein_family?.some(family => 
          filters.proteinFamily?.includes(family)
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
  const { bookmarkedArticleIds } = useBookmarks();

  return useQuery({
    queryKey: ['articles', searchQuery, filters, page, bookmarkedArticleIds],
    queryFn: () => fetchArticles(searchQuery, filters, page, bookmarkedArticleIds),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 10000),
  });
};
