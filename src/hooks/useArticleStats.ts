
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ArticleStats {
  proteinFamilies: { name: string; count: number }[];
  expressionSystems: { name: string; count: number }[];
  applications: { name: string; count: number }[];
  proteinForms: { name: string; count: number }[];
  totalArticles: number;
}

const fetchArticleStats = async (): Promise<ArticleStats> => {
  const { count } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { data: articles } = await supabase
    .from('articles')
    .select('facets_protein_family, facets_expression_system, facets_application, facets_protein_form');

  const stats: ArticleStats = {
    proteinFamilies: [],
    expressionSystems: [],
    applications: [],
    proteinForms: [],
    totalArticles: count || 0
  };

  // Helper function to count occurrences
  const countFacets = (arrays: (string[] | null)[]): { name: string; count: number }[] => {
    const counts = new Map<string, number>();
    arrays.forEach(arr => {
      if (arr) {
        arr.forEach(item => {
          counts.set(item, (counts.get(item) || 0) + 1);
        });
      }
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  if (articles) {
    stats.proteinFamilies = countFacets(articles.map(a => a.facets_protein_family));
    stats.expressionSystems = countFacets(articles.map(a => a.facets_expression_system));
    stats.applications = countFacets(articles.map(a => a.facets_application));
    stats.proteinForms = countFacets(articles.map(a => a.facets_protein_form));
  }

  return stats;
};

export const useArticleStats = () => {
  return useQuery({
    queryKey: ['articleStats'],
    queryFn: fetchArticleStats,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
