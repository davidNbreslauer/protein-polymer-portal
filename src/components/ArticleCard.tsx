
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
            >
              <Badge variant="pubmed" className="flex items-center gap-1.5">
                PMID: {article.pmid}
                <ExternalLink className="w-3.5 h-3.5" />
              </Badge>
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
          <p className="text-sm text-gray-600 leading-relaxed flex items-center gap-2">
            <Brain className="w-4 h-4 text-gray-400 shrink-0" />
            {article.summary || "No summary available."}
          </p>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(article.proteins || article.materials) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            {article.proteins && article.proteins.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-400" />
                  Proteins
                </h4>
                {article.proteins.map((protein, idx) => (
                  <div key={idx} className="bg-[#EBF3FF] rounded-lg p-4 space-y-2 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium text-gray-900">{protein.name}</h5>
                        {protein.type && (
                          <span className="text-xs bg-white/80 backdrop-blur-sm text-gray-700 px-2 py-0.5 rounded">{protein.type}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {protein.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {protein.derivedFrom && protein.derivedFrom.length > 0 && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-1">Derived from:</h6>
                          <div className="flex flex-wrap gap-1.5">
                            {protein.derivedFrom.map((source, i) => (
                              <span key={i} className="text-xs bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-gray-600">
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {protein.production && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-1">Production:</h6>
                          <p className="text-xs text-gray-600">{protein.production}</p>
                        </div>
                      )}
                    </div>
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
                  <div key={idx} className="bg-[#EBF3FF] rounded-lg p-4 space-y-2 shadow-sm">
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium text-gray-900">{material.name}</h5>
                      <p className="text-xs text-gray-600">
                        {material.description}
                      </p>
                    </div>
                    
                    {material.properties && material.properties.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-1">Key Properties:</h6>
                        <div className="flex flex-wrap gap-1.5">
                          {material.properties.map((prop, i) => (
                            <span key={i} className="text-xs bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-gray-600">
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
        )}

        {(article.methods?.length > 0 || article.analysisTools?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            {article.methods && article.methods.length > 0 && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Methods</h4>
                <ul className="space-y-1">
                  {article.methods.map((method, idx) => (
                    <li key={idx} className="text-xs text-gray-600">• {method}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {article.analysisTools && article.analysisTools.length > 0 && (
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Analysis Techniques</h4>
                <ul className="space-y-1">
                  {article.analysisTools.map((tool, idx) => (
                    <li key={idx} className="text-xs text-gray-600">• {tool}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {article.conclusions && (
          <div className="border-t pt-4">
            <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-gray-400" />
              Results & Conclusions
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {article.conclusions}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
