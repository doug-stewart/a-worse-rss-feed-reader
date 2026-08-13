import { useMutation, useQuery } from "@tanstack/react-query";
import { STALE_TIME } from "@/config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiFetch } from "@/helpers/apiFetch";
import { createFeed } from "../api/createFeed";
import { deleteFeed } from "../api/deleteFeed";
import { updateFeed } from "../api/updateFeed";
import type { Feed } from "../types";

export const useFeeds = () => {
  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["user", user?.id, "feeds"],
    queryFn: () => apiFetch("/feeds"),
    enabled: isAuthenticated,
    staleTime: STALE_TIME,
  });

  const createFn = useMutation({
    mutationFn: createFeed,
    onSuccess: () => query.refetch(),
  });

  const deleteFn = useMutation({
    mutationFn: deleteFeed,
    onSuccess: () => query.refetch(),
  });

  const updateFn = useMutation({
    mutationFn: updateFeed,
    onSuccess: () => query.refetch(),
  });

  const feeds = (query.data || []).sort((a: Feed, b: Feed) =>
    a.name.localeCompare(b.name),
  ) as Array<Feed>;

  return {
    feeds,
    createFeed: createFn,
    deleteFeed: deleteFn,
    updateFeed: updateFn,
    query,
  };
};
