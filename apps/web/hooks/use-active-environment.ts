import { getActiveEnvironment } from "@/utils/queries/environments";
import { ApiKey, Environment } from "@repo/database";
import { useQuery } from "@tanstack/react-query";

export const useActiveEnvironment = ({
  userId,
  projectId,
  enabled,
}: {
  userId: string;
  projectId: string;
  enabled: boolean;
}) => {
  const activeEnvironmentquery = useQuery({
    queryKey: ["activeEnvironment", userId, projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      const { data, success } = await getActiveEnvironment(projectId);
      if (!success) {
        throw new Error(
          "Something went wrong while fetching active environment!",
        );
      }
      return data as Environment & { apiKey: ApiKey };
    },
    enabled: enabled && !!userId && !!projectId,
  });

  return {
    activeEnvironment: activeEnvironmentquery.data,
    isLoading: activeEnvironmentquery.isLoading,
    isError: activeEnvironmentquery.isError,
    isPending: activeEnvironmentquery.isPending,
  };
};
