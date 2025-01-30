
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useArticles } from "@/hooks/useArticles";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

export const Index = () => {
  const { user } = useAuth();
  const { data, isLoading } = useArticles("", {}, 0);
  const { bookmarkedPmids } = useBookmarks();
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");

  const filteredArticles = showBookmarked 
    ? (data?.articles || []).filter(article => bookmarkedPmids.includes(article.pmid))
    : (data?.articles || []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async () => {
    setIsSigningUp(true);
    setError("");
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setError("Please check your email for the confirmation link.");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>
          
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full"
              onClick={handleSignIn}
              disabled={isSigningIn || isSigningUp}
            >
              {isSigningIn ? "Signing in..." : "Sign in"}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleSignUp}
              disabled={isSigningIn || isSigningUp}
            >
              {isSigningUp ? "Creating account..." : "Create account"}
            </Button>
          </div>
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
