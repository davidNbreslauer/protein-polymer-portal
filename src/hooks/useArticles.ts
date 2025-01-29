
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/types/article";

const fetchArticles = async (searchQuery: string = '') => {
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
      )
    `)
    .order('timestamp', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%, abstract.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Article[];
};

export const useArticles = (searchQuery: string) => {
  return useQuery({
    queryKey: ['articles', searchQuery],
    queryFn: () => fetchArticles(searchQuery),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
