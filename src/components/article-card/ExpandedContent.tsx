
import { Brain, BrainCircuit, ListCheck } from "lucide-react";
import type { Article } from "@/types/article";

interface ExpandedContentProps {
  article: Article;
}

export const ExpandedContent = ({ article }: ExpandedContentProps) => {
  return (
    <div className="space-y-4">
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
                  <div className="flex justify-between items-start">
                    <h5 className="text-sm font-medium text-gray-900">{protein.name}</h5>
                    {protein.type && (
                      <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">{protein.type}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {protein.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {protein.derived_from && (
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Derived from:</h6>
                      <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
                        {protein.derived_from}
                      </span>
                    </div>
                  )}
                  {protein.production_method && (
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Production:</h6>
                      <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
                        {protein.production_method}
                      </span>
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
              <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="space-y-1">
                  <h5 className="text-sm font-medium text-gray-900">{material.name}</h5>
                  <p className="text-xs text-gray-600">
                    {material.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {material.key_properties && material.key_properties.length > 0 && (
                    <div>
                      <h6 className="text-xs font-medium text-gray-700 mb-1">Properties:</h6>
                      <div className="flex flex-wrap gap-1.5">
                        {material.key_properties.map((prop, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(article.methods?.length > 0 || article.analysis_techniques?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          {article.methods && article.methods.length > 0 && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Methods</h4>
              <ul className="space-y-1">
                {article.methods.map((method, idx) => (
                  <li key={idx} className="text-xs text-gray-600">• {method.method_name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {article.analysis_techniques && article.analysis_techniques.length > 0 && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Analysis Techniques</h4>
              <ul className="space-y-1">
                {article.analysis_techniques.map((technique, idx) => (
                  <li key={idx} className="text-xs text-gray-600">• {technique.technique}</li>
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
  );
};
