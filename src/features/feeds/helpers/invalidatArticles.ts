import type { QueryClient } from "@tanstack/react-query";

export const invalidateArticles = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["articles"], refetchType: "all" });
};
