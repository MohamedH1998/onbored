import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SwitchWorkspaceResponse {
  message: string;
}

export const useWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to switch workspace: ${response.statusText}`);
      }

      const data: SwitchWorkspaceResponse = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaceContext"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    onError: (error) => {
      console.error("Failed to switch workspace:", error);
    },
  });
};
