
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";

interface FilterOptions {
  proteinFamily?: string[];
}

const ARTICLES_PER_PAGE = 20;

const fetchArticles = async (searchQuery: string = '', filters: FilterOptions = {}) => {
  try {
    // First, if we have protein family filters, get the relevant PMIDs
    let pmidsToFilter: string[] = [];
    if (filters.proteinFamily && filters.proteinFamily.length > 0) {
      const { data: filteredPmids, error: pmidError } = await supabase
        .from('facets')
        .select('article_pmid')
        .contains('protein_family', filters.proteinFamily);
        
      if (pmidError) throw pmidError;
      pmidsToFilter = filteredPmids?.map(row => row.article_pmid) || [];
      if (pmidsToFilter.length === 0) {
        return []; // No matches found for the protein family filter
      }
    }

    // Build the main query with pagination
    let query = supabase
      .from('articles')
      .select(`
        pmid,
        title,
        abstract,
        authors,
        timestamp,
        proteins:proteins (
          name,
          description
        ),
        materials:materials (
          name,
          description
        ),
        facets:facets (
          protein_family
        )
      `, { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(0, ARTICLES_PER_PAGE - 1);

    // Apply text search filter if present
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`);
    }

    // Apply PMID filter if we have protein family filters
    if (pmidsToFilter.length > 0) {
      query = query.in('pmid', pmidsToFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data as Article[];
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const useArticles = (searchQuery: string, filters: FilterOptions = {}) => {
  return useQuery({
    queryKey: ['articles', searchQuery, filters],
    queryFn: () => fetchArticles(searchQuery, filters),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry failed requests twice
  });
};
