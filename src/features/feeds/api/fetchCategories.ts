import { API_URL } from "@/config";

export const fetchCategories = async () => {
  const result = await fetch(`${API_URL}/api/categories`, {
    credentials: "include",
  });
  const categories = await result.json();
  return categories;
};
