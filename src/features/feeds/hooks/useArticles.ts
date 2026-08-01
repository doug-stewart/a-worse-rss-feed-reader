import { useQueries } from "@tanstack/react-query";
import { API_URL } from "@/config";

export const useArticles = (feedIds: Array<number>) => {
  const queries = useQueries({
    queries: feedIds.map((feed) => {
      return {
        queryKey: ["feeds", feed, "articles"],
        queryFn: () =>
          fetch(`${API_URL}/api/feeds/${feed}`, {
            credentials: "include",
          }).then((res) => res.json()),
      };
    }),
  });
  const articles = queries.flatMap((query) => query.data).filter(Boolean);

  const isPending = queries.some((query) => query.isPending);
  const totalQueries = queries.length;
  const pendingQueries = queries.filter((query) => query.isPending).length;

  return { articles, isPending, totalQueries, pendingQueries, queries };
};
