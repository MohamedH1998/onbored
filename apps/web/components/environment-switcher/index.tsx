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
import { Environment } from "@repo/database";
import { useRouter } from "next/navigation";
import { useWorkspaceContext } from "@/components/context-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEnvironments } from "@/hooks/use-environments";
import { switchEnvironment } from "@/utils/queries/environments";

const EnvironmentSwitcher = ({
  activeEnvironment,
}: {
  activeEnvironment: Environment | null;
}) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const { setContext, project } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [environments, setEnvironments] = useState<Environment[]>(
    activeEnvironment ? [activeEnvironment] : [],
  );

  const {
    environments: environmentsData,
    isError,
    isLoading,
  } = useEnvironments({
    userId: session?.user?.id || "",
    projectId: project?.id || "",
    enabled: isOpen,
  });

  useEffect(() => {
    if (environmentsData && !isError) {
      setEnvironments((prev) => {
        const newEnvironments = environmentsData;
        if (JSON.stringify(prev) === JSON.stringify(newEnvironments)) {
          return prev;
        }
        return newEnvironments;
      });
    }
  }, [environmentsData, isError]);

  const environmentItems = useMemo(() => {
    return environments?.map((environment) => ({
      id: environment.id,
      name: environment.name,
      slug: environment.slug,
      element: (
        <div key={environment.id} className="flex items-center gap-2">
          <span className="font-medium text-sm">{environment.name}</span>
          <span className="text-xs text-zinc-500">({environment.slug})</span>
        </div>
      ),
    }));
  }, [environments]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Select
      value={activeEnvironment?.slug || ""}
      onValueChange={() => switchEnvironment(activeEnvironment?.id)}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-full py-6 border-none px-2 shadow-none">
        <SelectValue>
          {activeEnvironment ? (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {activeEnvironment.name}
              </span>
              <span className="text-xs text-zinc-500">
                ({activeEnvironment.slug})
              </span>
            </div>
          ) : (
            "Select environment"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading">Loading...</SelectItem>
        ) : (
          environmentItems?.map((item) => (
            <SelectItem key={item.id} value={item.slug}>
              {item.element}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default EnvironmentSwitcher;
