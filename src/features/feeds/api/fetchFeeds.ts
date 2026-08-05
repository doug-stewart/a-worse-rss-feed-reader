import { apiFetch } from "@/helpers/apiFetch";

export const fetchFeeds = async () => {
  const results = await apiFetch("/feeds");
  const feeds = await results.json();
  return feeds;
};
