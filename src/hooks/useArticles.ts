
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";

interface FilterOptions {
  proteinFamily?: string[];
}

const fetchArticles = async (searchQuery: string = '', filters: FilterOptions = {}) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      proteins (
        name,
        description
      ),
      materials (
        name,
        description
      ),
      facets (
        protein_family
      )
    `)
    .order('timestamp', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%, abstract.ilike.%${searchQuery}%`);
  }

  if (filters.proteinFamily && filters.proteinFamily.length > 0) {
    const { data: filteredPmids } = await supabase
      .from('facets')
      .select('article_pmid')
      .contains('protein_family', filters.proteinFamily);
    
    const pmids = filteredPmids?.map(row => row.article_pmid) || [];
    if (pmids.length > 0) {
      query = query.in('pmid', pmids);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Article[];
};

export const useArticles = (searchQuery: string, filters: FilterOptions = {}) => {
  return useQuery({
    queryKey: ['articles', searchQuery, filters],
    queryFn: () => fetchArticles(searchQuery, filters),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
