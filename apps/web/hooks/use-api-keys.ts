import { useQuery } from "@tanstack/react-query";
import { getApiKeys } from "@/utils/queries/api-keys";

export const useApiKeys = (projectId: string) => {
  const activeProjectQuery = useQuery({
    queryKey: ["apiKeys", projectId],
    queryFn: async () => {
      const { data, success } = await getApiKeys({ projectId });
      if (!success) {
        throw new Error("Something went wrong while fetching active project!");
      }
      return data;
    },
  });

  return {
    apiKeys: activeProjectQuery.data,
    isLoading: activeProjectQuery.isLoading,
    isError: activeProjectQuery.isError,
    isPending: activeProjectQuery.isPending,
  };
};
