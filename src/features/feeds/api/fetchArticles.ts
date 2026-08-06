import { apiFetch } from "@/helpers/apiFetch";

export const fetchArticles = async (
  feedIds: Array<number> | undefined,
  categoryIds: Array<number> | undefined,
) => {
  const params = new URLSearchParams();

  if (feedIds) {
    params.append("feeds", feedIds.join(","));
  }
  if (categoryIds) {
    params.append("categories", categoryIds.join(","));
  }

  const search = params.toString();
  const url = `/articles${search ? `?${search}` : ""}`;

  const resspone = await apiFetch(url);

  return resspone;
};
