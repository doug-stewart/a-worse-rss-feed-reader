import { apiFetch } from "@/helpers/apiFetch";
import type { Category } from "../types";

export const createCategory = async (data: Omit<Category, "id">) => {
  const response = await apiFetch("/categories/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  return response.json();
};
