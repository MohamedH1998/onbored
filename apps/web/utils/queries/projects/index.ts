"use server";

import { db, Project } from "@repo/database";
import { getCurrentUser } from "@/utils/auth-helpers";
import { getActiveWorkspace } from "../workspaces";
import { cookies } from "next/headers";
import { createEnvironment } from "../environments";

export const getProjects = async (opts?: {
  flows?: boolean;
  onboredSessions?: boolean;
  workspaceId?: string;
}): Promise<{ success: boolean; data?: Project[]; error?: string }> => {
  try {
    let workspaceId = opts?.workspaceId;

    if (!workspaceId) {
      const workspace = await getActiveWorkspace();
      if (!workspace.success || !workspace.data) {
        return { success: false, error: "No workspace found", data: undefined };
      }
      workspaceId = workspace.data.id;
    }

    const projects = await db.project.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });

    return { success: true, data: projects, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch projects",
      data: undefined,
    };
  }
};

// Server action to get projects for a specific workspace
export const getProjectsForWorkspace = async (workspaceId: string) => {
  "use server";

  try {
    const projects = await db.project.findMany({
      where: {
        workspaceId: workspaceId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, data: projects, error: undefined };
  } catch (error) {
    console.error("Error fetching projects for workspace:", error);
    return {
      success: false,
      error: "Failed to fetch projects",
      data: undefined,
    };
  }
};

export const getProjectById = async (
  projectId: string,
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    return { success: true, data: project, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch project",
      data: undefined,
    };
  }
};

export const getProject = async ({
  projectId,
  opts,
}: {
  projectId: string;
  opts?: {
    funnels?: boolean;
  };
}) => {
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
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      include: {
        funnels: opts?.funnels ?? false,
        workspace: true,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found or unauthorized",
        data: undefined,
      };
    }

    return { success: true, data: project, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch project",
      data: undefined,
    };
  }
};

export const getActiveProject = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const cookieStore = await cookies();
    const cookieProjectId = cookieStore.get("projectId")?.value;

    if (!cookieProjectId) {
      const projects = await db.project.findMany({
        where: {
          workspaceId,
        },
      });

      if (projects.length > 0) {
        const firstProject = projects[0];
        cookieStore.set("projectId", firstProject.id);
        return { data: firstProject, success: true, error: undefined };
      } else {
        return { data: null, success: true, error: "No projects found" };
      }
    }
    const project = await db.project.findFirst({
      where: {
        id: cookieProjectId,
        workspaceId,
      },
    });

    if (!project) {
      cookieStore.delete("projectId");
      const projects = await db.project.findMany({
        where: {
          workspaceId,
        },
      });

      if (projects.length > 0) {
        const firstProject = projects[0];
        cookieStore.set("projectId", firstProject.id);
        return { data: firstProject, success: true, error: undefined };
      } else {
        return { data: null, success: true, error: "No projects found" };
      }
    }

    return { data: project, success: true, error: undefined };
  } catch (error) {
    console.error(`🔴 - Error getting active project: ${error}`);
    return { data: null, success: false, error: "Unauthorized" };
  }
};

export const createProject = async ({
  name,
  workspaceId,
  isOnboarding = false,
}: {
  name: string;
  workspaceId: string;
  isOnboarding?: boolean;
}) => {
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
    if (!user) {
      return { success: false, error: "User not found", data: undefined };
    }

    let project;

    project = await db.project.create({
      data: { name, workspaceId },
    });

    await Promise.all([
      createEnvironment({
        projectId: project.id,
        name: "Production",
        slug: "prod",
      }),
      createEnvironment({
        projectId: project.id,
        name: "Dev",
        slug: "dev",
      }),
    ]);

    const cookieStore = await cookies();
    cookieStore.set("projectId", project.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("mode", "prod", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    if (isOnboarding) {
      await db.onboardingProgress.update({
        where: { userId: user.id },
        data: { lastCompletedStep: "project", completed: true },
      });
    }

    return { success: true, data: project, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to create project",
      data: undefined,
    };
  }
};
