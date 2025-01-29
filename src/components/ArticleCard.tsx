
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-900">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500">
              {article.authors?.join(', ')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              PMID: {article.pmid}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary hover:text-primary/80"
            >
              {isExpanded ? "Less" : "More"}
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {article.abstract.slice(0, 200)}...
        </p>

        <div className={cn(
          "mt-6 space-y-6 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.proteins && article.proteins.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Proteins</h4>
                {article.proteins.map((protein, idx) => (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-sm font-medium">{protein.name}</h5>
                    <p className="text-sm text-gray-600">
                      {protein.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {article.materials && article.materials.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Materials</h4>
                {article.materials.map((material, idx) => (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-sm font-medium">{material.name}</h5>
                    <p className="text-sm text-gray-600">
                      {material.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
