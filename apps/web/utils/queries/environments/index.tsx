"use server";

import { db } from "@repo/database";
import { createApiKey } from "../api-keys";
import { revalidatePath } from "next/cache";
import { getCurrentUser, hasProjectAccess } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export const createEnvironment = async ({
  projectId,
  name,
  slug,
}: {
  projectId: string;
  name: string;
  slug: string;
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

    const hasAccess = await hasProjectAccess(user.id, projectId);

    if (!hasAccess) {
      return { success: false, error: "Unauthorized", data: undefined };
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: true,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
        data: undefined,
      };
    }

    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: project.workspace.id,
        userId: user.id,
      },
    });

    if (!workspaceMember) {
      return {
        success: false,
        error: "Access denied",
        data: undefined,
      };
    }

    const apiKey = await createApiKey({
      projectId,
      label: name,
    });

    if (!apiKey.success || !apiKey.data || Array.isArray(apiKey.data)) {
      return {
        success: false,
        error: "Failed to create API key",
        data: undefined,
      };
    }

    const environment = await db.environment.create({
      data: {
        projectId,
        name,
        slug,
        apiKeyId: apiKey.data.id,
      },
      include: {
        apiKey: true,
      },
    });

    revalidatePath("/settings");

    return {
      success: true,
      data: environment,
      error: undefined,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to create environment",
      data: undefined,
    };
  }
};

export const getEnvironmentsForProject = async (projectId: string) => {
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

    const hasAccess = await hasProjectAccess(user.id, projectId);

    if (!hasAccess) {
      return { success: false, error: "Unauthorized", data: undefined };
    }

    // Verify user has access to the project
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: true,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
        data: undefined,
      };
    }

    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: project.workspace.id,
        userId: user.id,
      },
    });

    if (!workspaceMember) {
      return {
        success: false,
        error: "Access denied",
        data: undefined,
      };
    }

    const environments = await db.environment.findMany({
      where: {
        projectId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: environments,
      error: undefined,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch environments",
      data: undefined,
    };
  }
};

export const getActiveEnvironment = async (projectId: string) => {
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

    const hasAccess = await hasProjectAccess(user.id, projectId);

    if (!hasAccess) {
      return { success: false, error: "Unauthorized", data: undefined };
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: true,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
        data: undefined,
      };
    }

    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: project.workspace.id,
        userId: user.id,
      },
    });

    if (!workspaceMember) {
      return {
        success: false,
        error: "Access denied",
        data: undefined,
      };
    }

    const activeEnvironment = (await cookies()).get("mode");

    const environments = await db.environment.findFirst({
      where: {
        projectId,
        slug: activeEnvironment?.value as string,
      },
      include: {
        apiKey: {
          select: {
            id: true,
            token: true,
            label: true,
            lastUsedAt: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: environments,
      error: undefined,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch environments",
      data: undefined,
    };
  }
};

export const switchEnvironment = async (environmentId: string | undefined) => {
  try {
    if (!environmentId) {
      return {
        success: false,
        error: "Environment ID is required",
        data: undefined,
      };
    }
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const user = userResult.data;

    if (!environmentId || !user) {
      return {
        success: false,
        error: "Environment ID is required",
        data: undefined,
      };
    }

    // Get the environment with its project and workspace
    const environment = await db.environment.findUnique({
      where: {
        id: environmentId,
      },
      include: {
        project: {
          include: {
            workspace: true,
          },
        },
        apiKey: true,
      },
    });

    if (!environment) {
      return {
        success: false,
        error: "Environment not found",
        data: undefined,
      };
    }

    const hasAccess = await hasProjectAccess(user.id, environment.project.id);

    if (!hasAccess) {
      return { success: false, error: "Unauthorized", data: undefined };
    }

    // Verify user has access to this environment's project
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: environment.project.workspace.id,
        userId: user.id,
      },
    });

    if (!workspaceMember) {
      return {
        success: false,
        error: "Access denied",
        data: undefined,
      };
    }

    // Get all environments for the project
    const environments = await db.environment.findMany({
      where: {
        projectId: environment.project.id,
      },
      include: {
        apiKey: true,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      data: {
        workspace: environment.project.workspace,
        project: environment.project,
        environment: environment,
        environments: environments,
      },
      error: undefined,
    };
  } catch (error) {
    console.error("Error switching environment:", error);
    return {
      success: false,
      error: "Internal server error",
      data: undefined,
    };
  }
};

export const deleteEnvironment = async (environmentId: string) => {
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
      return { success: false, error: "Unauthorized", data: undefined };
    }

    // Get the environment
    const environment = await db.environment.findUnique({
      where: { id: environmentId },
      include: {
        project: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!environment) {
      return {
        success: false,
        error: "Environment not found",
        data: undefined,
      };
    }

    // Verify user has access
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: environment.project.workspace.id,
        userId: user.id,
      },
    });

    if (!workspaceMember) {
      return {
        success: false,
        error: "Access denied",
        data: undefined,
      };
    }

    // Delete the environment
    await db.environment.delete({
      where: { id: environmentId },
    });

    revalidatePath("/settings");

    return {
      success: true,
      data: undefined,
      error: undefined,
    };
  } catch (error) {
    console.error("Error deleting environment:", error);
    return {
      success: false,
      error: "Internal server error",
      data: undefined,
    };
  }
};

export const rotateEnvironmentApiKey = async ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId: string;
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
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const hasAccess = await hasProjectAccess(user.id, projectId);

    if (!hasAccess) {
      return { success: false, error: "Unauthorized", data: undefined };
    }

    // Get the environment
    const environment = await db.environment.findUnique({
      where: { id: environmentId },
      include: {
        project: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!environment) {
      return {
        success: false,
        error: "Environment not found",
        data: undefined,
      };
    }

    // Verify user has access
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: environment.project.workspace.id,
        userId: user.id,
      },
    });

    if (!workspaceMember) {
      return {
        success: false,
        error: "Access denied",
        data: undefined,
      };
    }

    // Create new API key
    const newApiKey = await createApiKey({
      projectId: environment.projectId,
      label: environment.name,
    });

    if (
      !newApiKey.success ||
      !newApiKey.data ||
      Array.isArray(newApiKey.data)
    ) {
      return {
        success: false,
        error: "Failed to create new API key",
        data: undefined,
      };
    }

    // Update environment with new API key
    const updatedEnvironment = await db.environment.update({
      where: { id: environmentId },
      data: {
        apiKeyId: newApiKey.data.id,
      },
      include: {
        apiKey: true,
      },
    });

    revalidatePath(`/project/${projectId}/install`);

    return {
      success: true,
      data: updatedEnvironment,
      error: undefined,
    };
  } catch (error) {
    console.error("Error rotating API key:", error);
    return {
      success: false,
      error: "Internal server error",
      data: undefined,
    };
  }
};
