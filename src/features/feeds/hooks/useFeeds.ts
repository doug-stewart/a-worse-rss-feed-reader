import { useQuery } from "@tanstack/react-query";
import { STALE_TIME } from "@/config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiFetch } from "@/helpers/apiFetch";
import type { Feed } from "../types";

export const useFeeds = (): {
  feeds: Array<Feed>;
  query: ReturnType<typeof useQuery>;
} => {
  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["user", user?.id, "feeds"],
    queryFn: () => apiFetch("/feeds"),
    enabled: isAuthenticated,
    staleTime: STALE_TIME,
  });

  return { feeds: query.data || [], query };
};
