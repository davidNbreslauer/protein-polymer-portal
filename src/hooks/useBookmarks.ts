
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  const { data: bookmarkedPmids = [], isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return [];

      const { data, error } = await supabase
        .from('bookmarks')
        .select('article_pmid')
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Error fetching bookmarks:', error);
        return [];
      }

      return data.map(b => b.article_pmid);
    },
  });

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async (pmid: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Must be logged in to bookmark articles');
      }

      const isCurrentlyBookmarked = bookmarkedPmids.includes(pmid);

      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('article_pmid', pmid)
          .eq('user_id', session.session.user.id);

        if (error) throw error;
        return { pmid, action: 'removed' as const };
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            article_pmid: pmid,
            user_id: session.session.user.id,
          });

        if (error) throw error;
        return { pmid, action: 'added' as const };
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
    bookmarkedPmids,
    isLoadingBookmarks,
    toggleBookmark,
  };
};
