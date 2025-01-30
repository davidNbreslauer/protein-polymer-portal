
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/article";
import { useBookmarks } from "@/hooks/useBookmarks";
import { CardHeader } from "./article-card/CardHeader";
import { Summary } from "./article-card/Summary";
import { Tags } from "./article-card/Tags";
import { ExpandedContent } from "./article-card/ExpandedContent";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { bookmarkedPmids, toggleBookmark, isLoadingBookmarks } = useBookmarks();
  const isBookmarked = bookmarkedPmids.includes(article.pmid);

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
      <div className="p-6 space-y-4">
        <CardHeader
          article={article}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isBookmarked={isBookmarked}
          toggleBookmark={toggleBookmark}
          isLoadingBookmarks={isLoadingBookmarks}
        />

        <Summary article={article} />
        
        <Tags article={article} />

        <div className={cn(
          "space-y-4 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[2000px] opacity-100 pt-4" : "max-h-0 opacity-0"
        )}>
          <ExpandedContent article={article} />
        </div>
      </div>
    </article>
  );
};
