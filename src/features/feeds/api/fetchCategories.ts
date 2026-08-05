import { apiFetch } from "@/helpers/apiFetch";

export const fetchCategories = async () => {
  const result = await apiFetch("/categories");
  const categories = await result.json();
  return categories;
};
