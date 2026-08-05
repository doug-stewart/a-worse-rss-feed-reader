import { API_URL } from "@/config";

export const apiFetch = (path: string, options?: RequestInit | null, includeCredentials = true) => {
  const opts = Object.assign({}, options, includeCredentials ? { credentials: "include" } : null);
  return fetch(`${API_URL}/api${path}`, opts);
};
