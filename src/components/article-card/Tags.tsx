
import type { Article } from "@/types/article";

interface TagsProps {
  article: Article;
}

export const Tags = ({ article }: TagsProps) => {
  if (!article.tags || article.tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {article.tags.map((tag) => (
        <span 
          key={tag} 
          className="px-3 py-1 text-xs rounded-full bg-gray-50 text-gray-600"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
