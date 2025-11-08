"use server";

import { db } from "@repo/database";

import { getCurrentUser, hasProjectAccess } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export const getApiKeys = async ({ projectId }: { projectId: string }) => {
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

    const activeEnvironment = (await cookies()).get("mode");

    const apiKeys = await db.apiKey.findMany({
      where: {
        projectId,
        environment: {
          some: {
            slug: activeEnvironment?.value as string,
          },
        },
      },
    });

    return { success: true, data: apiKeys, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch api keys",
      data: undefined,
    };
  }
};

export const createApiKey = async ({
  projectId,
  label,
}: {
  projectId: string;
  label: string;
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

    const apiKey = await db.apiKey.create({
      data: {
        projectId,
        token: `pk_${crypto.randomUUID()}`,
        label,
        createdBy: user.id,
      },
    });

    return { success: true, data: apiKey, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to create api key",
      data: undefined,
    };
  }
};

export const revokeApiKey = async ({
  projectId,
  keyId,
}: {
  projectId: string;
  keyId: string;
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

    const apiKey = await db.apiKey.update({
      where: { id: keyId },
      data: { revoked: true },
    });

    return { success: true, data: apiKey, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to revoke api key",
      data: undefined,
    };
  }
};
