
import React from "react";
import { Article } from "@/types/article";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ArticleCard({ article }: { article: Article }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const formattedDate = article.timestamp
    ? formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })
    : "Date unknown";

  return (
    <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className="font-sans text-xl font-semibold text-gray-900 mb-2">
              {article.title}
            </h2>
            <div className="font-sans text-sm text-gray-500 mb-4">
              {article.authors?.join(", ") || "Unknown authors"} • {formattedDate}
            </div>
            
            {!isExpanded && (
              <p className="font-sans text-gray-600 mb-4">
                {article.summary || "No summary available."}
              </p>
            )}

            {article.proteinFamilies && article.proteinFamilies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.proteinFamilies.map((family, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="font-sans bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    {family}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              className="font-sans text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="flex items-center gap-1">
                {isExpanded ? (
                  <>
                    Show less
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show more
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </span>
            </Button>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-blue-600 hover:text-blue-700 whitespace-nowrap"
          >
            View paper
          </a>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            {article.abstract && (
              <div className="border-t pt-8">
                <h4 className="font-sans text-xl font-semibold text-gray-900 mb-4">Abstract</h4>
                <p className="font-sans text-gray-600 leading-relaxed">{article.abstract}</p>
              </div>
            )}

            {article.methods && article.methods.length > 0 && (
              <div className="border-t pt-8">
                <h4 className="font-sans text-xl font-semibold text-gray-900 mb-4">Methods</h4>
                <ul className="font-sans list-disc pl-5 space-y-2 text-gray-600">
                  {article.methods.map((method, index) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
            )}

            {article.analysisTools && article.analysisTools.length > 0 && (
              <div className="border-t pt-8">
                <h4 className="font-sans text-xl font-semibold text-gray-900 mb-4">Analysis Tools</h4>
                <ul className="font-sans list-disc pl-5 space-y-2 text-gray-600">
                  {article.analysisTools.map((tool, index) => (
                    <li key={index}>{tool}</li>
                  ))}
                </ul>
              </div>
            )}

            {article.conclusions && (
              <div className="border-t pt-8">
                <h4 className="font-sans text-xl font-semibold text-gray-900 mb-4">Results & Conclusions</h4>
                <p className="font-sans text-gray-600 leading-relaxed">
                  {article.conclusions}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
