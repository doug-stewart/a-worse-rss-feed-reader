import { apiFetch } from "@/helpers/apiFetch";
import type { Category } from "../types";

export const updateCategory = async (data: Category) => {
  const response = await apiFetch(`/category/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed update category: ${data.id}`);
  }
  return response.json();
};
