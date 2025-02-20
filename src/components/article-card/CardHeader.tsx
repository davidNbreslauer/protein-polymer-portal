
import { ExternalLink, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/article";
import { UseMutateFunction } from "@tanstack/react-query";

interface CardHeaderProps {
  article: Article;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isBookmarked: boolean;
  toggleBookmark: UseMutateFunction<{ articleId: number; action: "removed" | "added" }, Error, number, unknown>;
  isLoadingBookmarks: boolean;
}

export const CardHeader = ({
  article,
  isExpanded,
  setIsExpanded,
  isBookmarked,
  toggleBookmark,
  isLoadingBookmarks,
}: CardHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1 flex-1">
        <h3 className="font-medium text-gray-900 text-base">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500">
          {article.authors}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isLoadingBookmarks}
          onClick={() => toggleBookmark(article.id)}
        >
          <Bookmark 
            className={cn(
              "h-4 w-4",
              isBookmarked ? "fill-current" : "fill-none"
            )} 
          />
        </Button>
        {article.pubmed_id && (
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge variant="pubmed" className="flex items-center gap-1.5">
              PMID: {article.pubmed_id}
              <ExternalLink className="w-3.5 h-3.5" />
            </Badge>
          </a>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
      </div>
    </div>
  );
};
