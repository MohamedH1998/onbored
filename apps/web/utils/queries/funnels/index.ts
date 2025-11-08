"use server";

import { db, FunnelStatus } from "@repo/database";
import { getCurrentUser, hasProjectAccess } from "@/utils/auth-helpers";
import z from "zod";

type ActivationRuleInput = {
  name: string;
  type: string;
  stepName?: string;
  eventName?: string;
  conditions?: any;
};

type FunnelInput = {
  name: string;
  version?: string | null;
  status?: FunnelStatus;
  slug: string;
  steps?: Array<{
    order: number;
    stepName: string;
    key: string;
    metadata?: any;
  }>;
  activationRule?: ActivationRuleInput;
};

export const upsertFunnel = async ({
  funnel,
  projectId,
  activationRule,
}: {
  funnel: FunnelInput;
  projectId: string;
  activationRule?: ActivationRuleInput;
}) => {
  try {
    // Validate input
    if (!funnel?.name) throw new Error("Funnel name is required");
    if (!projectId) throw new Error("Project ID is required");

    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const user = userResult.data;
    if (!user) throw new Error("User not found");

    // Check access and get workspace member
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true },
    });
    if (!project) throw new Error("Project not found");

    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        userId: user.id,
        workspaceId: project.workspaceId,
      },
    });
    if (!workspaceMember) throw new Error("Access denied to this project");

    const result = await db.funnel.upsert({
      where: {
        projectId_name: {
          projectId,
          name: funnel.name,
        },
      },
      create: {
        name: funnel.name,
        projectId,
        slug: funnel.slug,
        createdById: workspaceMember.id,
        version: funnel.version ?? null,
        status: funnel.status ?? FunnelStatus.DRAFT,
        steps: funnel.steps
          ? {
              create: funnel.steps.map((step: any) => ({
                order: step.order,
                stepName: step.stepName,
                key: step.key,
                metadata: step.metadata ?? undefined,
              })),
            }
          : undefined,
      },
      update: {
        name: funnel.name,
        version: funnel.version ?? null,
        status: funnel.status ?? FunnelStatus.DRAFT,
        createdById: workspaceMember.id,
        steps: funnel.steps
          ? {
              deleteMany: {},
              create: funnel.steps.map((step: any) => ({
                order: step.order,
                stepName: step.stepName,
                key: step.key,
                metadata: step.metadata ?? undefined,
              })),
            }
          : undefined,
      },
    });

    return { success: true, data: result, error: undefined };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to upsert funnel",
      data: undefined,
    };
  }
};

export const getFunnel = async ({
  funnelId,
  projectId,
}: {
  funnelId: string;
  projectId: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const parsedFunnelId = z.string().parse(funnelId);

    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return {
        success: false,
        error: "Unauthorized",
        data: undefined,
      };
    }

    const user = userResult.data;
    if (!user) throw new Error("User not found");

    const hasAccess = await hasProjectAccess(user.id, projectId);

    if (!hasAccess) throw new Error("Access denied to this project");

    const funnel = await db.funnel.findUnique({
      where: { id: parsedFunnelId },
      include: {
        steps: true,
      },
    });

    return {
      success: true,
      data: funnel,
      error: undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get funnel",
      data: undefined,
    };
  }
};

export const projectHasFunnels = async (
  projectId: string,
): Promise<boolean> => {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return false;
    }

    const user = userResult.data;
    if (!user) return false;

    const hasAccess = await hasProjectAccess(user.id, projectId);
    if (!hasAccess) return false;

    const count = await db.funnel.count({
      where: { projectId },
    });

    return count > 0;
  } catch (error) {
    return false;
  }
};

export const getFunnelWithInsights = async (
  funnelId: string,
  projectId: string,
  from: Date,
  to: Date,
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
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
    if (!user) throw new Error("User not found");

    const hasAccess = await hasProjectAccess(user.id, projectId);

    if (!hasAccess) throw new Error("Access denied to this project");
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      include: {
        steps: true,
        insights: {
          orderBy: { timestamp: "desc" },
          where: {
            timestamp: {
              gte: from,
              lte: to,
            },
          },
        },
        stepInsights: {
          orderBy: { timestamp: "desc" },
          where: {
            timestamp: {
              gte: from,
              lte: to,
            },
          },
        },
        flowPathInsights: {
          orderBy: { updatedAt: "desc" },
          where: {
            updatedAt: {
              gte: from,
              lte: to,
            },
          },
        },
      },
    });

    if (!funnel) throw new Error("Funnel not found");

    return {
      success: true,
      data: funnel,
      error: undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get funnel with insights",
      data: undefined,
    };
  }
};
