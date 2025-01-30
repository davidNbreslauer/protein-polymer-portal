import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Brain, BrainCircuit } from "lucide-react";
import type { Article } from "@/types/article";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "bg-white rounded-lg border p-4 transition-all duration-200 ease-in-out",
        isExpanded && "border-blue-200 shadow-lg"
      )}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{article.title}</h3>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="border-t pt-4">
            <p className="text-xs text-gray-600 leading-relaxed">{article.abstract}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            {article.proteins && article.proteins.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-400" />
                  Proteins
                </h4>
                {article.proteins.map((protein, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">
                          {protein.name}
                        </h5>
                        {protein.type === 'engineered' && (
                          <Badge variant="secondary" className="text-xs">
                            Engineered
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{protein.description}</p>
                    </div>
                    {protein.derivedFrom && protein.derivedFrom.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-700">
                          Derived from:
                        </span>
                        <ul className="mt-1 list-disc list-inside">
                          {protein.derivedFrom.map((source, idx) => (
                            <li key={idx} className="text-xs text-gray-600">
                              {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {protein.production && (
                      <div>
                        <span className="text-xs font-medium text-gray-700">
                          Production:
                        </span>
                        <p className="mt-1 text-xs text-gray-600">
                          {protein.production}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {article.materials && article.materials.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-gray-400" />
                  Materials
                </h4>
                {article.materials.map((material, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">{material.name}</h5>
                    <p className="text-xs text-gray-600">{material.description}</p>
                    {material.properties && material.properties.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-700">
                          Properties:
                        </span>
                        <ul className="mt-1 list-disc list-inside">
                          {material.properties.map((property, idx) => (
                            <li key={idx} className="text-xs text-gray-600">
                              {property}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="text-base font-semibold text-gray-900">Results</h4>
            <p className="text-xs text-gray-600">{article.results}</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-base font-semibold text-gray-900">Conclusions</h4>
            <p className="text-xs text-gray-600">{article.conclusions}</p>
          </div>
        </div>
      )}
    </div>
  );
};
