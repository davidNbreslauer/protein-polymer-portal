import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";
import { useBookmarks } from "./useBookmarks";

interface FilterOptions {
  proteinFamily?: string[];
  proteinType?: string[];
  proteinCategory?: string[];
  proteinSubcategory?: string[];
  showBookmarksOnly?: boolean;
  sortDirection?: 'asc' | 'desc';
  showReviewsOnly?: boolean;
  excludeReviews?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}

const fetchArticles = async (searchQuery: string = '', filters: FilterOptions = {}, page: number = 0, pageSize: number = 10, bookmarkedArticleIds: number[] = []) => {
  try {
    if (filters.showBookmarksOnly && (!bookmarkedArticleIds || bookmarkedArticleIds.length === 0)) {
      return { articles: [], totalCount: 0 };
    }

    let totalCount = 0;
    
    let filteredArticleIds: number[] = [];
    if (filters.proteinType?.length) {
      const { data: proteinData } = await supabase
        .from('proteins')
        .select('article_id')
        .in('type', filters.proteinType);
      
      filteredArticleIds = (proteinData || []).map(item => item.article_id);
      
      if (filteredArticleIds.length === 0) {
        return { articles: [], totalCount: 0 };
      }
    }
    
    let countQuery = supabase.from('articles')
      .select('*', { count: 'exact', head: true });

    if (filteredArticleIds.length > 0) {
      countQuery = countQuery.in('id', filteredArticleIds);
    }

    if (filters.proteinCategory?.length) {
      countQuery = countQuery.overlaps('facets_protein_categories', filters.proteinCategory);
    }

    if (filters.proteinSubcategory?.length) {
      countQuery = countQuery.overlaps('facets_protein_subcategories', filters.proteinSubcategory);
    }

    if (filters.showBookmarksOnly) {
      countQuery = countQuery.in('id', bookmarkedArticleIds);
    }

    if (filters.showReviewsOnly) {
      countQuery = countQuery.ilike('publication_type', '%review%');
    } else if (filters.excludeReviews) {
      countQuery = countQuery.not('publication_type', 'ilike', '%review%');
    }

    if (searchQuery) {
      countQuery = countQuery.or(
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
    }

    if (filters.startDate) {
      const startDateStr = filters.startDate.toISOString().split('T')[0];
      countQuery = countQuery.gte('pub_date', startDateStr);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      const endDateStr = endDate.toISOString().split('T')[0];
      countQuery = countQuery.lt('pub_date', endDateStr);
    }

    const { count, error: countError } = await countQuery;
    
    if (countError) throw countError;
    totalCount = count || 0;

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

    if (filteredArticleIds.length > 0) {
      query = query.in('id', filteredArticleIds);
    }

    if (filters.proteinCategory?.length) {
      query = query.overlaps('facets_protein_categories', filters.proteinCategory);
    }

    if (filters.proteinSubcategory?.length) {
      query = query.overlaps('facets_protein_subcategories', filters.proteinSubcategory);
    }

    if (filters.showBookmarksOnly) {
      query = query.in('id', bookmarkedArticleIds);
    }

    if (filters.showReviewsOnly) {
      query = query.ilike('publication_type', '%review%');
    } else if (filters.excludeReviews) {
      query = query.not('publication_type', 'ilike', '%review%');
    }

    if (searchQuery) {
      query = query.or(
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
    }

    if (filters.startDate) {
      const startDateStr = filters.startDate.toISOString().split('T')[0];
      query = query.gte('pub_date', startDateStr);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      const endDateStr = endDate.toISOString().split('T')[0];
      query = query.lt('pub_date', endDateStr);
    }

    query = query.order('pub_date', { ascending: filters.sortDirection === 'asc' });

    query = query.range(page * pageSize, (page + 1) * pageSize - 1);

    console.log('Fetching articles with filters:', JSON.stringify(filters, null, 2));

    const { data: articles, error } = await query;
    
    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    
    if (!articles) {
      console.log('No articles found');
      return { articles: [], totalCount: 0 };
    }

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
    staleTime: 1000 * 60 * 5,
  });
};
