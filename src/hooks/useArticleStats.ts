
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ArticleStats {
  proteinFamilies: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  expressionSystems: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  applications: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  proteinForms: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  totalArticles: number;
  mostRecentDate: string | null;
}

const fetchArticleStats = async (): Promise<ArticleStats> => {
  const { count } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { data: articles } = await supabase
    .from('articles')
    .select('id, pubmed_id, title, facets_protein_family, facets_expression_system, facets_application, facets_protein_form, pub_date');

  const { data: mostRecent } = await supabase
    .from('articles')
    .select('pub_date')
    .order('pub_date', { ascending: false })
    .limit(1)
    .single();

  const stats: ArticleStats = {
    proteinFamilies: [],
    expressionSystems: [],
    applications: [],
    proteinForms: [],
    totalArticles: count || 0,
    mostRecentDate: mostRecent?.pub_date || null
  };

  // Helper function to count occurrences case-insensitively
  const countFacets = (arrays: { id: number, facets: (string[] | null), pubmed_id?: string, title: string }[]): { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[] => {
    const counts = new Map<string, { originalName: string; count: number; articles: { pubmed_id?: string; title: string }[] }>();
    let noFacetsArticles: { pubmed_id?: string; title: string }[] = [];
    
    arrays.forEach(({ facets, pubmed_id, title }) => {
      if (!facets || facets.length === 0) {
        noFacetsArticles.push({ pubmed_id, title });
      } else {
        facets.forEach(item => {
          const lowerItem = item.toLowerCase();
          const existing = counts.get(lowerItem);
          
          if (existing) {
            existing.count += 1;
            existing.articles.push({ pubmed_id, title });
            counts.set(lowerItem, existing);
          } else {
            counts.set(lowerItem, {
              originalName: item,
              count: 1,
              articles: [{ pubmed_id, title }]
            });
          }
        });
      }
    });

    const result = Array.from(counts.entries())
      .map(([_, { originalName, count, articles }]) => ({
        name: originalName,
        count,
        articles
      }))
      .sort((a, b) => b.count - a.count);

    // Add the "no facets" entry if there are any articles without facets
    if (noFacetsArticles.length > 0) {
      result.push({
        name: '',
        count: noFacetsArticles.length,
        articles: noFacetsArticles
      });
    }

    return result;
  };

  if (articles) {
    stats.proteinFamilies = countFacets(
      articles.map(a => ({ id: a.id, facets: a.facets_protein_family, pubmed_id: a.pubmed_id, title: a.title }))
    );
    stats.expressionSystems = countFacets(
      articles.map(a => ({ id: a.id, facets: a.facets_expression_system, pubmed_id: a.pubmed_id, title: a.title }))
    );
    stats.applications = countFacets(
      articles.map(a => ({ id: a.id, facets: a.facets_application, pubmed_id: a.pubmed_id, title: a.title }))
    );
    stats.proteinForms = countFacets(
      articles.map(a => ({ id: a.id, facets: a.facets_protein_form, pubmed_id: a.pubmed_id, title: a.title }))
    );
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
