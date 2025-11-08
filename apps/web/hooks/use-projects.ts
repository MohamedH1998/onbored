import { getProjectsForWorkspace } from "@/utils/queries/projects";
import { useQuery } from "@tanstack/react-query";

export const useProjects = (
  userId: string,
  workspaceId?: string,
  enabled: boolean = true,
) => {
  const projectsQuery = useQuery({
    queryKey: ["projects", userId, workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const { data, success } = await getProjectsForWorkspace(workspaceId);
      if (!success) {
        throw new Error("Something went wrong while fetching projects!");
      }
      return data;
    },
    enabled: enabled && !!userId && !!workspaceId,
  });

  return {
    projects: projectsQuery.data,
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    isPending: projectsQuery.isPending,
  };
};
