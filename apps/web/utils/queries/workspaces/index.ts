"use server";

import { db } from "@repo/database";
import { getCurrentUser } from "@/utils/auth-helpers";
import { pickRandomGradient } from "@/data/constants";
import { generateSlug } from "@/utils/helpers";
import { getCookieContext, setWorkspaceCookie } from "@/utils/cookie-helpers";
import type { ServerActionResult } from "@/utils/types";
import { success, error } from "@/utils/types";
import type { Environment, Project, Workspace } from "@repo/database";

export const getWorkspaces = async (): Promise<
  ServerActionResult<Workspace[]>
> => {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const user = userResult.data;

    const workspaces = await db.workspace.findMany({
      where: {
        members: { some: { userId: user.id } },
      },
      include: {
        projects: true,
      },
    });

    return success(workspaces);
  } catch (err) {
    console.error("Failed to fetch workspaces", err);
    return error("Failed to fetch workspaces");
  }
};

export const getWorkspace = async (
  workspaceId: string,
): Promise<ServerActionResult<Workspace>> => {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const user = userResult.data;

    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        members: { some: { userId: user.id } },
      },
    });

    if (!workspace) {
      return error("Workspace not found or access denied");
    }

    return success(workspace);
  } catch (err) {
    console.error("Failed to fetch workspace", err, { workspaceId });
    return error("Failed to fetch workspace");
  }
};

export const getActiveWorkspace = async (): Promise<
  ServerActionResult<Workspace | null>
> => {
  try {
    const { workspaceId } = await getCookieContext();

    if (!workspaceId) {
      return error("No active workspace");
    }

    return await getWorkspace(workspaceId);
  } catch (err) {
    console.error("Failed to get active workspace", err);
    return error("Failed to get active workspace");
  }
};

export const createWorkspace = async ({
  userId,
  name,
  isOnboarding = false,
}: {
  userId: string;
  name: string;
  isOnboarding?: boolean;
}): Promise<ServerActionResult<{ workspace: Workspace }>> => {
  try {
    const workspace = await db.workspace.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, "-"),
        gradient: pickRandomGradient(),
      },
    });

    await db.workspaceMember.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    if (isOnboarding) {
      await db.onboardingProgress.update({
        where: { userId },
        data: { lastCompletedStep: "workspace" },
      });
    }

    await setWorkspaceCookie(workspace.id);

    return success({ workspace });
  } catch (err) {
    console.error("Failed to create workspace", err, { userId, name });
    return error("Failed to create workspace");
  }
};

export const getWorkspaceContext = async () => {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const user = userResult.data;
    const {
      workspaceId: cookieWorkspaceId,
      projectId: cookieProjectId,
      mode,
    } = await getCookieContext();

    const userWorkspaces = await db.workspace.findMany({
      where: {
        members: { some: { userId: user.id } },
      },
      include: {
        projects: {
          orderBy: { createdAt: "asc" },
          include: {
            funnels: true,
            Environment: true,
          },
        },
      },
    });

    if (!userWorkspaces.length) {
      return {
        workspace: null,
        project: null,
        environment: null,
        hasWorkspace: false,
        hasProject: false,
        hasEnvironment: false,
      };
    }

    let activeWorkspace = userWorkspaces.find(
      (w) => w.id === cookieWorkspaceId,
    );
    if (!activeWorkspace) {
      activeWorkspace = userWorkspaces[0];
    }

    // Find active project
    let activeProject = activeWorkspace.projects.find(
      (p) => p.id === cookieProjectId,
    );
    if (!activeProject && activeWorkspace.projects.length > 0) {
      activeProject = activeWorkspace.projects[0];
    }

    let activeEnvironment = null;
    if (activeProject) {
      activeEnvironment =
        activeProject.Environment.find((env) => env.slug === mode) ??
        activeProject.Environment.find((env) => env.slug === "prod") ??
        activeProject.Environment[0] ??
        null;
    }

    return {
      workspace: activeWorkspace,
      project: activeProject || null,
      environment: activeEnvironment,
      hasWorkspace: true,
      hasProject: !!activeProject,
      hasEnvironment: !!activeEnvironment,
    };
  } catch (err) {
    console.error("Failed to get workspace context", err);
    return {
      workspace: null,
      project: null,
      environment: null,
      hasWorkspace: false,
      hasProject: false,
      hasEnvironment: false,
    };
  }
};

export const checkWorkspaceName = async (
  name: string,
): Promise<
  ServerActionResult<{ isUnique: boolean; name: string; slug: string }>
> => {
  try {
    if (!name || name.trim().length === 0) {
      return error("Workspace name is required");
    }

    const slug = generateSlug(name);

    const existingWorkspace = await db.workspace.findUnique({
      where: { slug },
      select: { id: true },
    });

    return success({
      isUnique: !existingWorkspace,
      name: name.trim(),
      slug,
    });
  } catch (err) {
    console.error("Failed to check workspace name", err, { name });
    return error("Failed to check workspace name");
  }
};

export const getFirstWorkspace = async (): Promise<
  ServerActionResult<
    Workspace & { projects: (Project & { Environment: Environment[] })[] }
  >
> => {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const user = userResult.data;

    const workspace = await db.workspace.findFirst({
      where: { members: { some: { userId: user.id } } },
      include: {
        projects: {
          include: { Environment: true },
          take: 1,
        },
      },
    });

    if (!workspace) {
      return error("No workspace found");
    }

    return success(workspace);
  } catch (err) {
    console.error("Failed to get first workspace", err);
    return error("Failed to get first workspace");
  }
};
