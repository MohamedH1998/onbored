"use server";

import { auth } from "@/lib/auth";
import { db } from "@repo/database";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import type { ServerActionResult } from "./types";
import { success, error } from "./types";
import type { User, ApiKey, Environment } from "@repo/database";

/**
 * Get the current authenticated user
 * Returns a ServerActionResult instead of throwing
 */
export async function getCurrentUser(): Promise<ServerActionResult<User>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return error("Unauthorized");
    }

    return success(session.user as User);
  } catch (err) {
    console.error("Error getting current user:", err);
    return error("Failed to authenticate user");
  }
}

/**
 * Check if a user has access to a specific project
 */
export async function hasProjectAccess(
  userId: string,
  projectId: string,
): Promise<ServerActionResult<boolean>> {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });

    if (!project) {
      return error("Project not found");
    }

    const member = await db.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId: project.workspaceId,
      },
    });

    if (!member) {
      return error("Access denied to this project");
    }

    return success(true);
  } catch (err) {
    console.error("Error checking project access:", err);
    return error("Failed to check project access");
  }
}

/**
 * Check if a user has access to a specific project (returns boolean)
 * @deprecated Use requireProjectAccess() instead for better error handling
 */
export async function userHasProjectAccess(
  userId: string,
  projectId: string,
): Promise<boolean> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { workspaceId: true },
  });

  if (!project) return false;

  const member = await db.workspaceMember.findFirst({
    where: {
      userId,
      workspaceId: project.workspaceId,
    },
  });

  return !!member;
}

/**
 * Check if a user has access to a specific workspace
 */
export async function hasWorkspaceAccess(
  userId: string,
  workspaceId: string,
): Promise<ServerActionResult<boolean>> {
  try {
    const member = await db.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!member) {
      return error("Access denied to this workspace");
    }

    return success(true);
  } catch (err) {
    console.error("Error checking workspace access:", err);
    return error("Failed to check workspace access");
  }
}

export interface ProjectAccessContext {
  user: User;
  environment: Environment & { apiKey: ApiKey };
  apiKey: ApiKey;
}

/**
 * Combined helper that validates user authentication, project access, and retrieves environment/API key
 * This replaces the common pattern of calling getCurrentUser, hasProjectAccess, and fetching environment
 *
 * @param projectId - The project ID to check access for
 * @returns ServerActionResult with user, environment, and apiKey on success
 *
 * @example
 * const authResult = await hasProjectAccessWithEnvironment(projectId);
 * if (!authResult.success) {
 *   return { success: false, error: authResult.error };
 * }
 * const { user, environment, apiKey } = authResult.data;
 */
export async function hasProjectAccessWithEnvironment(
  projectId: string,
): Promise<ServerActionResult<ProjectAccessContext>> {
  try {
    // Get current user
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return error("Unauthorized");
    }

    const user = userResult.data;

    // Check project access
    const accessResult = await hasProjectAccess(user.id, projectId);
    if (!accessResult.success) {
      return error(accessResult.error);
    }

    // Get active environment and API key
    const activeEnvironment = (await cookies()).get("mode")?.value;
    const environment = await db.environment.findFirstOrThrow({
      where: {
        project: {
          id: projectId,
        },
        slug: activeEnvironment || "production",
      },
      include: {
        apiKey: true,
      },
    });

    if (!environment.apiKey) {
      return error("No active API key found for this project");
    }

    return success({
      user,
      environment,
      apiKey: environment.apiKey,
    });
  } catch (err) {
    console.error("Error in hasProjectAccessWithEnvironment:", err);
    return error("Failed to authenticate or retrieve project environment");
  }
}
