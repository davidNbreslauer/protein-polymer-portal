
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useArticles } from "@/hooks/useArticles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";

export const Index = () => {
  const { user } = useAuth();
  const { articles, isLoading } = useArticles();
  const { bookmarkedPmids } = useBookmarks();
  const [showBookmarked, setShowBookmarked] = useState(false);

  const filteredArticles = showBookmarked 
    ? articles.filter(article => bookmarkedPmids.includes(article.pmid))
    : articles;

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          Please sign in to view articles
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-end">
        <Button
          variant={showBookmarked ? "default" : "outline"}
          onClick={() => setShowBookmarked(!showBookmarked)}
          className="flex items-center gap-2"
        >
          <BookmarkIcon className="h-4 w-4" />
          {showBookmarked ? "Show all" : "Show bookmarked"}
        </Button>
      </div>

      <div className="space-y-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.pmid} article={article} />
          ))
        ) : (
          <p className="text-center text-gray-600">
            {showBookmarked 
              ? "No bookmarked articles found"
              : "No articles found"
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;
