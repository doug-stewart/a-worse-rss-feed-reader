import { API_URL } from "@/config";

export const apiFetch = async (
  path: string,
  options?: RequestInit | null,
  includeCredentials = true,
) => {
  try {
    const opts = Object.assign({}, options, includeCredentials ? { credentials: "include" } : null);
    const response = await fetch(`${API_URL}/api${path}`, opts);
    if (!response.ok) {
      throw response;
    }
    const data = response.json();
    return data;
  } catch (error) {
    if (error instanceof Response && error.status !== 401) {
      console.error("Error fetching API:", { path, options, error });
    }
    return null;
  }
};
