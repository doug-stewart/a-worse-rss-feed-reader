import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/helpers/apiFetch";

export const useAuth = () => {
  const query = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await apiFetch("/auth/me");
      if (!res.ok) {
        throw new Error("Failed to fetch auth");
      }
      return res.json();
    },
  });

  const user = query.data;
  const isAuthenticated = !!user;
  const { isSuccess } = query;

  return { user, isAuthenticated, isSuccess, query };
};
