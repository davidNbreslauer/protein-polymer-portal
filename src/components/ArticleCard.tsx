
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h3 className="font-medium text-gray-900 text-base">
              {article.title}
            </h3>
            <p className="text-xs text-gray-500">
              {article.authors?.join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gray-900 px-3 py-1.5 rounded-lg text-white flex items-center gap-1.5 hover:bg-gray-800 transition-colors"
            >
              PMID: {article.pmid}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-medium text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? 'Less' : 'More'}
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {article.summary || "No summary available."}
          </p>
        </div>

        {article.tags && article.tags.length > 0 && (
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
        )}

        <div className={cn(
          "space-y-8 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[2000px] opacity-100 pt-4" : "max-h-0 opacity-0"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
            {article.proteins && article.proteins.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Proteins</h4>
                {article.proteins.map((protein, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-base font-medium text-gray-900">{protein.name}</h5>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Engineered</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {protein.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {protein.derivedFrom && protein.derivedFrom.length > 0 && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-2">Derived from:</h6>
                          <div className="flex gap-2">
                            {protein.derivedFrom.map((source, i) => (
                              <span key={i} className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {protein.production && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-2">Production:</h6>
                          <p className="text-xs text-gray-600">{protein.production}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {article.materials && article.materials.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Materials</h4>
                {article.materials.map((material, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="space-y-2">
                      <h5 className="text-base font-medium text-gray-900">{material.name}</h5>
                      <p className="text-sm text-gray-600">
                        {material.description}
                      </p>
                    </div>
                    
                    {material.properties && material.properties.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Key Properties:</h6>
                        <div className="flex flex-wrap gap-2">
                          {material.properties.map((prop, i) => (
                            <span key={i} className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                              {prop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {(article.methods?.length > 0 || article.analysisTools?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
              {article.methods && article.methods.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Methods</h4>
                  <ul className="space-y-2">
                    {article.methods.map((method, idx) => (
                      <li key={idx} className="text-sm text-gray-600">• {method}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {article.analysisTools && article.analysisTools.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Techniques</h4>
                  <ul className="space-y-2">
                    {article.analysisTools.map((tool, idx) => (
                      <li key={idx} className="text-sm text-gray-600">• {tool}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {article.conclusions && (
            <div className="border-t pt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Results & Conclusions</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {article.conclusions}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

