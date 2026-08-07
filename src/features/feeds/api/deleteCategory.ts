import { apiFetch } from "@/helpers/apiFetch";
import type { Category } from "../types";

export const deleteCategory = async (id: Category["id"]) => {
  const response = await apiFetch(`/categories/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed delete category: ${id}`);
  }
  return response.json();
};
