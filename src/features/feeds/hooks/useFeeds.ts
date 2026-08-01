import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { fetchFeeds } from "@/features/feeds/api/fetchFeeds";
import type { Feed } from "../types";

export const useFeeds = (): {
  feeds: Array<Feed>;
  query: ReturnType<typeof useQuery>;
} => {
  const { user, isAuthenticated } = useAuth();
  const query = useQuery({
    queryKey: ["user", user?.id, "feeds"],
    queryFn: fetchFeeds,
    enabled: isAuthenticated && !!user?.id,
  });

  return { feeds: query.data || [], query };
};
