
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  const { data: bookmarkedArticleIds = [], isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return [];

      // Fetch bookmarks for the authenticated user
      const { data, error } = await supabase
        .from('bookmarks')
        .select('article_id')
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Error fetching bookmarks:', error);
        return [];
      }

      return data.map(b => b.article_id);
    },
  });

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async (articleId: number) => {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Must be logged in to bookmark articles');
      }

      const isCurrentlyBookmarked = bookmarkedArticleIds.includes(articleId);

      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', session.session.user.id);

        if (error) throw error;
        return { articleId, action: 'removed' as const };
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            article_id: articleId,
            user_id: session.session.user.id,
          });

        if (error) throw error;
        return { articleId, action: 'added' as const };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success(
        result.action === 'added' 
          ? 'Article bookmarked successfully' 
          : 'Bookmark removed successfully'
      );
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update bookmark');
    },
  });

  return {
    bookmarkedArticleIds,
    isLoadingBookmarks,
    toggleBookmark,
  };
};
