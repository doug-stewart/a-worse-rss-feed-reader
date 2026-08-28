import { apiFetch } from "@/helpers/apiFetch";
import type { ArticleListLayouts, Category } from "../types";

export const updateCategoryLayout = async ({
  categortyId,
  layout,
}: {
  categortyId: Category["id"];
  layout: ArticleListLayouts;
}) => {
  const response = await apiFetch(`/categories/${categortyId}/layout`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_layout: layout }),
  });
  if (!response.ok) {
    throw new Error(`Failed update category layout for ${categortyId}`);
  }
  return response.json();
};
