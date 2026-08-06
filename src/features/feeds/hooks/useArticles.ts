import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { STALE_TIME } from "@/config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchArticles } from "../api/fetchArticles";
import { setAritclesRead } from "../api/setArticlesRead";
import { setAritclesUnread } from "../api/setArticlesUnread";
import type { Article } from "../types";

export const useArticles = (feedIds?: Array<number>, categoryIds?: Array<number>) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["articles", { feedIds, categoryIds }],
    queryFn: () => fetchArticles(feedIds, categoryIds),
    enabled: isAuthenticated,
    staleTime: STALE_TIME,
  });

  const markRead = useMutation({
    mutationFn: setAritclesRead,
  });

  const markUnread = useMutation({
    mutationFn: setAritclesUnread,
  });

  const refetchArticles = () => {
    queryClient.invalidateQueries({ queryKey: ["articles"], refetchType: "all" });
  };

  const articles = (Array.isArray(query.data) ? query.data : []) as Array<Article>;

  return {
    articles,
    query,
    markRead,
    markUnread,
    refetchArticles,
  };
};
