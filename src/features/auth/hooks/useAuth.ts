import { API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const query = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch auth");
      }
      return res.json();
    },
  });

  const user = query.data;
  const isAuthenticated = !!user;
  const {isSuccess} = query;

  return {user, isAuthenticated,isSuccess, query};
};
