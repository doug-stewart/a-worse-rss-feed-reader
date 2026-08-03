import { API_URL } from "@/config";

export const setAritclesRead = async (ids: Array<number>) => {
  const response = await fetch(`${API_URL}/api/articles/read`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error("Failed to mark articles as read");
  }
  return response.json();
};
