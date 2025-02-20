
import type { Article } from "@/types/article";

interface TagsProps {
  article: Article;
}

export const Tags = ({ article }: TagsProps) => {
  // Create a combined array of all facets
  const allFacets = [
    ...(article.facets_protein_family || []),
    ...(article.facets_protein_form || []),
    ...(article.facets_expression_system || []),
    ...(article.facets_application || []),
    ...(article.facets_structural_motifs || []),
    ...(article.facets_tested_properties || [])
  ];
  
  if (allFacets.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {allFacets.map((facet, index) => (
        <span 
          key={`${facet}-${index}`}
          className="px-3 py-1 text-xs rounded-full bg-gray-50 text-gray-600"
        >
          {facet}
        </span>
      ))}
    </div>
  );
};
