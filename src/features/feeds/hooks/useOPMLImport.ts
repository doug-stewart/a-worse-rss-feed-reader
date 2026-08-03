import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config";

export const useOPMLImport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File | undefined) => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const result = await fetch(`${API_URL}/api/opml/import`, {
        credentials: "include",
        method: "POST",
        body: formData,
      });

      const data = await result.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"], refetchType: "all" });
    },
  });

  return mutation;
};
