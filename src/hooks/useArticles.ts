
import { useQuery } from "@tanstack/react-query";
import { useBookmarks } from "./useBookmarks";
import { fetchArticles } from "./article/useArticleQuery";
import { FilterOptions } from "./article/types";

export { FilterOptions } from "./article/types";

export const useArticles = (searchQuery: string, filters: FilterOptions = {}, page: number = 0, pageSize: number = 10) => {
  const { bookmarkedArticleIds } = useBookmarks();

  return useQuery({
    queryKey: ['articles', searchQuery, filters, page, pageSize, bookmarkedArticleIds],
    queryFn: () => fetchArticles(searchQuery, filters, page, pageSize, bookmarkedArticleIds),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
