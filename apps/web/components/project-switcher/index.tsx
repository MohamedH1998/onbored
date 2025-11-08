"use client";

import { ChevronDownIcon } from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth";
import { Project } from "@repo/database";

import { useProjects } from "@/hooks/use-projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useWorkspaceContext } from "@/components/context-provider";

const ProjectSwitcher = ({
  activeProject,
}: {
  activeProject: Project | null;
}) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { workspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(
    activeProject ? [activeProject] : [],
  );

  const { projects: projectsData, isError } = useProjects(
    session?.user?.id || "",
    workspace?.id,
    isOpen,
  );

  useEffect(() => {
    if (projectsData && !isError) {
      setProjects((prev) => {
        const newProjects = projectsData;
        if (JSON.stringify(prev) === JSON.stringify(newProjects)) {
          return prev;
        }
        return newProjects;
      });
    }
  }, [projectsData, isError]);

  const { setContext } = useWorkspaceContext();

  // Memoize project items to prevent unnecessary re-renders
  const projectItems = useMemo(() => {
    return projects?.map((project) => ({
      id: project.id,
      name: project.name,
      // gradient: project.gradient,
      element: (
        <div key={project.id} className="flex items-center gap-2">
          {/* <span
            className={`w-4.5 h-4.5 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 inline-block`}
          /> */}
          <span className="font-medium text-sm">{project.name}</span>
        </div>
      ),
    }));
  }, [projects]);

  const switchProject = useCallback(
    async (projectId: string) => {
      const targetProject = projects.find((p) => p.id === projectId);
      if (!targetProject) return;

      try {
        const res = await fetch("/api/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });

        if (!res.ok) {
          throw new Error("Failed to switch project");
        }

        const data = await res.json();

        setContext({
          workspace: data.workspace,
          project: data.project,
          hasWorkspace: true,
          hasProject: true,
          hasEnvironment: !!data.environment,
          environment: data.environment || null,
        });

        // Batch invalidations for better performance
        queryClient.invalidateQueries({
          queryKey: ["projects"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["flows"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["funnels"],
          exact: false,
        });

        router.push("/");
      } catch (error) {
        console.error("Failed to switch project:", error);
        // Show error toast or notification here if you have one
      }
    },
    [projects, setContext, queryClient, router],
  );

  // Memoize the open change handler
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Select
      value={activeProject?.id || ""}
      onValueChange={switchProject}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-full py-6 border-none px-2 shadow-none">
        <SelectValue>
          {activeProject ? (
            <div className="flex items-center gap-2">
              {/* <span
                className={`w-4.5 h-4.5 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 inline-block`}
              /> */}
              <span className="font-medium text-sm">{activeProject.name}</span>
            </div>
          ) : (
            "Select project"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {projectItems?.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.element}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectSwitcher;
