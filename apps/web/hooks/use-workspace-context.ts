import { getWorkspaceContext } from "@/utils/queries/workspaces";
import { useQuery } from "@tanstack/react-query";

export const useWorkspaceContext = (userId: string) => {
  return useQuery({
    queryKey: ["workspaceContext", userId],
    queryFn: async () => {
      const context = await getWorkspaceContext();
      return context;
    },
    // Keep workspace context fresh for 10 minutes since it rarely changes
    staleTime: 10 * 60 * 1000,
    // Keep in cache for 15 minutes
    gcTime: 15 * 60 * 1000,
    // Don't refetch on window focus for workspace context
    refetchOnWindowFocus: false,
    // Don't refetch on reconnect for workspace context
    refetchOnReconnect: false,
    // Only refetch if data is older than 10 minutes
    refetchInterval: 10 * 60 * 1000,
  });
};
