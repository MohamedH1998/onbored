"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { authClient } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getGradient } from "@/data/constants";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { Workspace } from "@repo/database";
import { useRouter } from "next/navigation";
import { useWorkspaceContext } from "@/components/context-provider";
import { useQueryClient } from "@tanstack/react-query";

const WorkspaceSwitcher = ({
  activeWorkspace,
}: {
  activeWorkspace: Workspace | null;
}) => {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    activeWorkspace ? [activeWorkspace] : [],
  );

  const { workspaces: workspacesData, isError } = useWorkspaces(
    session?.user?.id || "",
    isOpen,
  );

  useEffect(() => {
    if (workspacesData && !isError) {
      setWorkspaces((prev) => {
        const newWorkspaces = workspacesData;
        if (JSON.stringify(prev) === JSON.stringify(newWorkspaces)) {
          return prev;
        }
        return newWorkspaces;
      });
    }
  }, [workspacesData, isError]);

  const { setContext } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const workspaceItems = useMemo(() => {
    return workspaces?.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      gradient: workspace.gradient,
      element: (
        <div key={workspace.id} className="flex items-center gap-2">
          {/* <span
            className={`w-4.5 h-4.5 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 inline-block ${getGradient(
              workspace.gradient
            )}`}
          /> */}
          <span className="font-medium text-sm">{workspace.name}</span>
        </div>
      ),
    }));
  }, [workspaces]);

  const switchWorkspace = useCallback(
    async (workspaceId: string) => {
      const targetWorkspace = workspaces.find((w) => w.id === workspaceId);
      if (!targetWorkspace) return;

      const previousContext = {
        workspace: activeWorkspace,
        project: null,
        hasWorkspace: true,
        hasProject: false,
        hasEnvironment: false,
        environment: null,
      };

      setContext({
        workspace: targetWorkspace,
        project: null,
        environment: null,
        hasWorkspace: true,
        hasProject: false,
        hasEnvironment: false,
      });

      try {
        const res = await fetch("/api/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workspaceId }),
        });

        if (!res.ok) {
          throw new Error("Failed to switch workspace");
        }

        const data = await res.json();

        // Update with actual data
        setContext({
          workspace: data.workspace,
          project: data.project,
          environment: null,
          hasWorkspace: true,
          hasProject: !!data.project,
          hasEnvironment: false,
        });

        if (data.projects && session?.user?.id) {
          queryClient.setQueryData(
            ["projects", session.user.id, data.workspace.id],
            data.projects,
          );
        }

        // Batch invalidations
        queryClient.invalidateQueries({
          queryKey: ["flows"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["funnels"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["workspaceContext"],
          exact: false,
        });

        router.push("/");
      } catch (error) {
        console.error("Failed to switch workspace:", error);
        // Revert optimistic update on error
        setContext(previousContext);
      }
    },
    [
      workspaces,
      activeWorkspace,
      setContext,
      queryClient,
      router,
      session?.user?.id,
    ],
  );

  // Memoize the open change handler
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Select
      value={activeWorkspace?.id || ""}
      onValueChange={switchWorkspace}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-full py-6 border-none px-2 shadow-none">
        <SelectValue>
          {activeWorkspace ? (
            <div className="flex items-center gap-2">
              {/* <span
                className={`w-4.5 h-4.5 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 inline-block ${getGradient(
                  activeWorkspace.gradient
                )}`}
              /> */}
              <span className="font-medium text-sm">
                {activeWorkspace.name}
              </span>
            </div>
          ) : (
            "Select workspace"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {workspaceItems?.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.element}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default WorkspaceSwitcher;
