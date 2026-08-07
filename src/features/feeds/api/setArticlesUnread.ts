import { apiFetch } from "@/helpers/apiFetch";

export const setAritclesUnread = async (ids: Array<number>) => {
  const response = await apiFetch("/articles/unread", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error("Failed to mark articles as read");
  }
  return response.json();
};
