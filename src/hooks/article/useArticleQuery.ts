
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";
import { FilterOptions, ArticlesResponse } from "./types";
import { applySearchFilter, applyDateFilters, applyViewFilters } from "./filterUtils";

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
    
    // Get filtered article IDs based on protein type if specified
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
    
    // Build count query to get total number of results
    let countQuery = supabase.from('articles')
      .select('*', { count: 'exact', head: true });

    // Apply article ID filter if we have filtered IDs
    if (filteredArticleIds.length > 0) {
      countQuery = countQuery.in('id', filteredArticleIds);
    }

    // Apply protein category/subcategory filters
    if (filters.proteinCategory?.length) {
      countQuery = countQuery.overlaps('facets_protein_categories', filters.proteinCategory);
    }

    if (filters.proteinSubcategory?.length) {
      countQuery = countQuery.overlaps('facets_protein_subcategories', filters.proteinSubcategory);
    }

    // Apply bookmark filter if requested
    if (filters.showBookmarksOnly) {
      countQuery = countQuery.in('id', bookmarkedArticleIds);
    }

    // Apply view filters (reviews only/exclude reviews)
    countQuery = applyViewFilters(countQuery, filters);

    // Apply search query if provided
    if (searchQuery) {
      countQuery = applySearchFilter(countQuery, searchQuery);
    }

    // Apply date filters if provided
    countQuery = applyDateFilters(countQuery, filters.startDate, filters.endDate);

    // Get total count of matching articles
    const { count, error: countError } = await countQuery;
    
    if (countError) throw countError;
    totalCount = count || 0;

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

    // Apply view filters (reviews only/exclude reviews)
    query = applyViewFilters(query, filters);

    // Apply search query if provided
    if (searchQuery) {
      query = applySearchFilter(query, searchQuery);
    }

    // Apply date filters if provided
    query = applyDateFilters(query, filters.startDate, filters.endDate);

    // Apply sorting
    query = query.order('pub_date', { ascending: filters.sortDirection === 'asc' });

    // Apply pagination
    query = query.range(page * pageSize, (page + 1) * pageSize - 1);

    console.log('Fetching articles with filters:', JSON.stringify(filters, null, 2));

    // Execute main query
    const { data: articles, error } = await query;
    
    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    
    if (!articles) {
      console.log('No articles found');
      return { articles: [], totalCount: 0 };
    }

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
    throw error;
  }
};
