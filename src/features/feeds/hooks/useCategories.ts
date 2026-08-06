import { useQuery } from "@tanstack/react-query";
import { STALE_TIME } from "@/config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiFetch } from "@/helpers/apiFetch";
import type { Category } from "../types";

export const useCategories = (): {
  categories: Array<Category>;
  query: ReturnType<typeof useQuery>;
} => {
  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["user", user?.id, "categories"],
    queryFn: () => apiFetch("/categories"),
    enabled: isAuthenticated,
    staleTime: STALE_TIME,
  });

  return { categories: query.data || [], query };
};
