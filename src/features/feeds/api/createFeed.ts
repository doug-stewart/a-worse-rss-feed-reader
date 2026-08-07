import { apiFetch } from "@/helpers/apiFetch";
import type { Feed } from "../types";

export const createFeed = async (data: Omit<Feed, "id">) => {
  const response = await apiFetch("/feeds/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create feed");
  }
  return response.json();
};
