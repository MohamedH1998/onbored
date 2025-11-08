import { getEnvironmentsForProject } from "@/utils/queries/environments";
import { useQuery } from "@tanstack/react-query";

export const useEnvironments = ({
  userId,
  projectId,
  enabled,
}: {
  userId: string;
  projectId: string;
  enabled: boolean;
}) => {
  const environmentsQuery = useQuery({
    queryKey: ["environments", userId, projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      const { data, success } = await getEnvironmentsForProject(projectId);
      if (!success) {
        throw new Error("Something went wrong while fetching environments!");
      }
      return data;
    },
    enabled: enabled && !!userId && !!projectId,
  });

  return {
    environments: environmentsQuery.data,
    isLoading: environmentsQuery.isLoading,
    isError: environmentsQuery.isError,
    isPending: environmentsQuery.isPending,
  };
};
