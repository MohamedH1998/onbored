import { getWorkspaces } from "@/utils/queries/workspaces";
import { useQuery } from "@tanstack/react-query";

export const useWorkspaces = (userId: string, enabled: boolean = true) => {
  const workspacesQuery = useQuery({
    queryKey: ["workspaces", userId],
    queryFn: async () => {
      const { data, success } = await getWorkspaces();
      if (!success) {
        throw new Error("Something went wrong while fetching workspaces!");
      }
      return data;
    },
    enabled: enabled && !!userId,
  });

  return {
    workspaces: workspacesQuery.data,
    isLoading: workspacesQuery.isLoading,
    isError: workspacesQuery.isError,
  };
};
