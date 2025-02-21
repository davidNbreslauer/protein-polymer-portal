
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";

interface ArticleStats {
  proteins: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  materials: { name: string; count: number; articles?: { pubmed_id?: string; title: string }[] }[];
  totalArticles: number;
  mostRecentDate: string | null;
  articlesWithoutProteins: Article[];
  articlesWithoutMaterials: Article[];
}

const fetchArticleStats = async (): Promise<ArticleStats> => {
  try {
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
          name
        ),
        materials (
          name
        )
      `);

    const { data: mostRecent } = await supabase
      .from('articles')
      .select('pub_date')
      .order('pub_date', { ascending: false })
      .limit(1)
      .single();

    // Get articles without proteins
    const { data: articlesWithoutProteins } = await supabase
      .from('articles')
      .select(`
        id,
        pubmed_id,
        title,
        proteins!inner (
          id
        )
      `)
      .is('proteins.id', null);

    // Get articles without materials
    const { data: articlesWithoutMaterials } = await supabase
      .from('articles')
      .select(`
        id,
        pubmed_id,
        title,
        materials!inner (
          id
        )
      `)
      .is('materials.id', null);

    const stats: ArticleStats = {
      proteins: [],
      materials: [],
      totalArticles: count || 0,
      mostRecentDate: mostRecent?.pub_date || null,
      articlesWithoutProteins: articlesWithoutProteins || [],
      articlesWithoutMaterials: articlesWithoutMaterials || []
    };

    // Helper function to count occurrences case-insensitively
    const countItems = (items: { name: string | null; article: { pubmed_id?: string; title: string } }[]): { name: string; count: number; articles: { pubmed_id?: string; title: string }[] }[] => {
      const counts = new Map<string, { count: number; articles: { pubmed_id?: string; title: string }[] }>();
      
      items.forEach(({ name, article }) => {
        if (name && name.trim()) {
          const lowerName = name.toLowerCase();
          const existing = counts.get(lowerName);
          
          if (existing) {
            existing.count += 1;
            existing.articles.push(article);
            counts.set(lowerName, existing);
          } else {
            counts.set(lowerName, {
              count: 1,
              articles: [article]
            });
          }
        }
      });

      return Array.from(counts.entries())
        .map(([name, { count, articles }]) => ({
          name,
          count,
          articles
        }))
        .sort((a, b) => b.count - a.count);
    };

    if (articles) {
      // Process proteins
      const proteinItems = articles.flatMap(article => 
        article.proteins?.map(protein => ({
          name: protein.name,
          article: { pubmed_id: article.pubmed_id, title: article.title }
        })) || []
      );
      stats.proteins = countItems(proteinItems);

      // Process materials
      const materialItems = articles.flatMap(article => 
        article.materials?.map(material => ({
          name: material.name,
          article: { pubmed_id: article.pubmed_id, title: article.title }
        })) || []
      );
      stats.materials = countItems(materialItems);
    }

    console.log('Processed stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching article stats:', error);
    throw error;
  }
};

export const useArticleStats = () => {
  return useQuery({
    queryKey: ['articleStats'],
    queryFn: fetchArticleStats,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
