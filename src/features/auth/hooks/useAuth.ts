import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { API_URL } from "@/config";
import { apiFetch } from "@/helpers/apiFetch";

export const useAuth = () => {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["auth"],
    queryFn: () => apiFetch("/auth/me"),
    retry: false,
  });

  const { isFetched: isLoaded } = query;
  const user = query.data;
  const isAuthenticated = isLoaded && !!user;

  const login = () => navigate({ to: `${API_URL}/api/auth/login` });
  const logout = () => navigate({ to: `${API_URL}/api/auth/logout` });

  return { user, isAuthenticated, isLoaded, login, logout, query };
};
