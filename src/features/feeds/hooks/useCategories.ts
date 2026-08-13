import { useMutation, useQuery } from "@tanstack/react-query";
import { STALE_TIME } from "@/config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { apiFetch } from "@/helpers/apiFetch";
import { createCategory } from "../api/createCategory";
import { deleteCategory } from "../api/deleteCategory";
import { updateCategory } from "../api/updateCategory";
import type { Category } from "../types";

export const useCategories = () => {
  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["user", user?.id, "categories"],
    queryFn: () => apiFetch("/categories"),
    enabled: isAuthenticated,
    staleTime: STALE_TIME,
  });

  const createFn = useMutation({
    mutationFn: createCategory,
    onSuccess: () => query.refetch(),
  });

  const deleteFn = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => query.refetch(),
  });

  const updateFn = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => query.refetch(),
  });

  const categories = (query.data || []).sort((a: Category, b: Category) =>
    a.name.localeCompare(b.name),
  ) as Array<Category>;

  return {
    categories,
    createCategory: createFn,
    deleteCategory: deleteFn,
    updateCategory: updateFn,
    query,
  };
};
