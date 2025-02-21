
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ArticleStats {
  proteinFamilies: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  expressionSystems: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  applications: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  proteinForms: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  materialProperties: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  totalArticles: number;
  mostRecentDate: string | null;
}

const fetchArticleStats = async (): Promise<ArticleStats> => {
  const { count } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  // Get all articles with their related proteins and materials
  const { data: articles } = await supabase
    .from('articles')
    .select(`
      id,
      pubmed_id,
      title,
      pub_date,
      proteins (
        protein_family,
        protein_form,
        expression_system,
        applications
      ),
      materials (
        key_properties
      )
    `);

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
    materialProperties: [],
    totalArticles: count || 0,
    mostRecentDate: mostRecent?.pub_date || null
  };

  // Helper function to count occurrences case-insensitively
  const countItems = (items: (string | null)[], articles: { pubmed_id?: string; title: string }[]): { name: string; count: number; articles: { pubmed_id?: string; title: string }[] }[] => {
    const counts = new Map<string, { originalName: string; count: number; articles: { pubmed_id?: string; title: string }[] }>();
    let noItemArticles: { pubmed_id?: string; title: string }[] = [];
    
    items.forEach((item, index) => {
      if (!item) {
        noItemArticles.push(articles[index]);
      } else {
        const lowerItem = item.toLowerCase();
        const existing = counts.get(lowerItem);
        
        if (existing) {
          existing.count += 1;
          existing.articles.push(articles[index]);
          counts.set(lowerItem, existing);
        } else {
          counts.set(lowerItem, {
            originalName: item,
            count: 1,
            articles: [articles[index]]
          });
        }
      }
    });

    const result = Array.from(counts.entries())
      .map(([_, { originalName, count, articles }]) => ({
        name: originalName,
        count,
        articles
      }))
      .sort((a, b) => b.count - a.count);

    // Add the "no items" entry if there are any articles without items
    if (noItemArticles.length > 0) {
      result.push({
        name: '',
        count: noItemArticles.length,
        articles: noItemArticles
      });
    }

    return result;
  };

  if (articles) {
    // Process protein families
    const proteinFamilies = articles.flatMap(article => 
      article.proteins?.map(protein => ({
        value: protein.protein_family,
        article: { pubmed_id: article.pubmed_id, title: article.title }
      })) || []
    );
    stats.proteinFamilies = countItems(
      proteinFamilies.map(p => p.value),
      proteinFamilies.map(p => p.article)
    );

    // Process protein forms
    const proteinForms = articles.flatMap(article => 
      article.proteins?.map(protein => ({
        value: protein.protein_form,
        article: { pubmed_id: article.pubmed_id, title: article.title }
      })) || []
    );
    stats.proteinForms = countItems(
      proteinForms.map(p => p.value),
      proteinForms.map(p => p.article)
    );

    // Process expression systems
    const expressionSystems = articles.flatMap(article => 
      article.proteins?.map(protein => ({
        value: protein.expression_system,
        article: { pubmed_id: article.pubmed_id, title: article.title }
      })) || []
    );
    stats.expressionSystems = countItems(
      expressionSystems.map(p => p.value),
      expressionSystems.map(p => p.article)
    );

    // Process applications from proteins
    const applications = articles.flatMap(article => 
      article.proteins?.flatMap(protein => 
        (protein.applications || []).map(app => ({
          value: app,
          article: { pubmed_id: article.pubmed_id, title: article.title }
        }))
      ) || []
    );
    stats.applications = countItems(
      applications.map(a => a.value),
      applications.map(a => a.article)
    );

    // Process material properties
    const materialProperties = articles.flatMap(article => 
      article.materials?.flatMap(material => 
        (material.key_properties || []).map(prop => ({
          value: prop,
          article: { pubmed_id: article.pubmed_id, title: article.title }
        }))
      ) || []
    );
    stats.materialProperties = countItems(
      materialProperties.map(p => p.value),
      materialProperties.map(p => p.article)
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
