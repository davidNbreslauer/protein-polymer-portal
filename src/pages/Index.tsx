
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useArticles } from "@/hooks/useArticles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Index = () => {
  const { user } = useAuth();
  const { data, isLoading } = useArticles("", {}, 0);
  const { bookmarkedPmids } = useBookmarks();
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const filteredArticles = showBookmarked 
    ? (data?.articles || []).filter(article => bookmarkedPmids.includes(article.pmid))
    : (data?.articles || []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Please sign in to view articles
          </p>
          <Button 
            onClick={handleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing in..." : "Sign in with GitHub"}
          </Button>
        </div>
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
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={async () => await supabase.auth.signOut()}
        >
          Sign out
        </Button>
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
