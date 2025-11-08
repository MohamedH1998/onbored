"use client";

import { SidebarTrigger } from "../ui/sidebar";
import WorkspaceSwitcher from "../workspace-switcher";
import ProjectSwitcher from "../project-switcher";
import EnvironmentSwitcher from "../environment-switcher";
import { useWorkspaceContext } from "@/components/context-provider";
import React from "react";

const Header = React.memo(
  ({ showSidebarTrigger = true }: { showSidebarTrigger?: boolean }) => {
    const { workspace, project, environment } = useWorkspaceContext();

    return (
      <nav className="flex min-w-full px-3 border-b-1 border-zinc-200 z-10 justify-between items-center">
        <div className="flex items-center gap-3">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger />
              <span className="h-6 border-r-2"></span>
              <WorkspaceSwitcher activeWorkspace={workspace} />
              <span className="text-zinc-200 text-2xl">/</span>
              <ProjectSwitcher activeProject={project} />
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <EnvironmentSwitcher activeEnvironment={environment} />
        </div>
      </nav>
    );
  },
);

Header.displayName = "Header";

export default Header;
