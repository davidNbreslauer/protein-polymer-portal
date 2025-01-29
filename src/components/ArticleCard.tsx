
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500">
              {article.authors?.join(', ')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              PMID: {article.pmid}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            {article.abstract.slice(0, 200)}...
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Tissue Engineering", "Drug Delivery", "Elastomeric proteins"].map((tag) => (
            <span 
              key={tag} 
              className="px-2.5 py-1 text-xs rounded-full bg-gray-50 text-gray-600 border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={cn(
          "space-y-6 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
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
