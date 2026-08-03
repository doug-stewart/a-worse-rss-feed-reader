import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config";
import { setAritclesRead } from "../api/setArticlesRead";
import { setAritclesUnread } from "../api/setArticlesUnread";
import type { Article } from "../types";

export const useArticles = (feedIds?: Array<number>, categoryIds?: Array<number>) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["articles", { feedIds, categoryIds }],
    queryFn: async () => {
      const params = new URLSearchParams();
      feedIds && params.append("feeds", feedIds.join(","));
      categoryIds && params.append("categories", categoryIds.join(","));
      const search = params.toString();
      const url = `${API_URL}/api/articles${search ? `?${search}` : ""}`;
      const resspone = await fetch(url, { credentials: "include" });
      const data = await resspone.json();
      return data;
    },
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

  return {
    articles: (Array.isArray(query.data) ? query.data : []) as Array<Article>,
    query,
    markRead,
    markUnread,
    refetchArticles,
  };
};
