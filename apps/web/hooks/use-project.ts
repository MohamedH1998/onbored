import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      return await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", "projects", "workspaceContext"],
      });
    },
  });
};
