import { apiFetch } from "@/helpers/apiFetch";
import type { Feed } from "../types";

export const deleteFeed = async (id: Feed["id"]) => {
  const response = await apiFetch(`/feeds/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed delete feed: ${id}`);
  }
  return response.json();
};
