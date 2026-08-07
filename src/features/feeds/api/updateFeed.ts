import { apiFetch } from "@/helpers/apiFetch";
import type { Feed } from "../types";

export const updateFeed = async (data: Feed) => {
  const response = await apiFetch(`/feeds/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed update feed: ${data.id}`);
  }
  return response.json();
};
