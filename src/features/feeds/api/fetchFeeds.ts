import { API_URL } from "@/config";

export const fetchFeeds = async () => {
  const results = await fetch(`${API_URL}/api/feeds`, {
    credentials: "include",
  });
  const feeds = await results.json();
  return feeds;
};
