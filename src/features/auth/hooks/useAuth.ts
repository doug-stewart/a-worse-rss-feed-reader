import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/helpers/apiFetch";

export const useAuth = () => {
  const query = useQuery({
    queryKey: ["auth"],
    queryFn: () => apiFetch("/auth/me"),
    retry: false,
  });

  const { isFetched: isLoaded } = query;
  const user = query.data;
  const isAuthenticated = isLoaded && !!user;

  return { user, isAuthenticated, isLoaded, query };
};
