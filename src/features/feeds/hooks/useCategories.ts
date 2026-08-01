import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchCategories } from "@/features/feeds/api/fetchCategories";
import type { Category } from "../types";

export const useCategories = (): {
  categories: Array<Category>;
  query: ReturnType<typeof useQuery>;
} => {
  const { user, isAuthenticated } = useAuth();
  const query = useQuery({
    queryKey: ["user", user?.id, "categories"],
    queryFn: fetchCategories,
    enabled: isAuthenticated && !!user?.id,
  });
  return { categories: query.data || [], query };
};
