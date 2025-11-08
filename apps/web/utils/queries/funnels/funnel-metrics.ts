"use server";

import { getCurrentUser, hasProjectAccess } from "../../auth-helpers";

import { db } from "@repo/database";
import {
  getFlowSummaryByFunnelFromWorker,
  getFunnelDropoffsByStepFromWorker,
  getFunnelLastStepDropoffsFromWorker,
  getFunnelStepMetricsFromWorker,
} from "@/lib/analytics/client";
import { cookies } from "next/headers";

interface FunnelMetricsParams {
  funnelId: string;
  projectId: string;
  from: string;
  to: string;
}

export async function getFunnelStepMetrics(params: FunnelMetricsParams) {
  try {
    const { funnelId, projectId, from, to } = params;

    // Validate user and access
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
        error: "User not found",
        data: undefined,
      };
    }

    const hasAccess = await hasProjectAccess(user.id, projectId);
    if (!hasAccess) {
      return {
        success: false,
        error: "Access denied to this project",
        data: undefined,
      };
    }

    // Get project and funnel details
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      select: { slug: true },
    });

    if (!funnel) {
      return {
        success: false,
        error: "Funnel not found",
        data: undefined,
      };
    }

    const activeEnvironment = (await cookies()).get("mode");
    const environment = activeEnvironment?.value
      ? await db.environment.findFirstOrThrow({
          where: { slug: activeEnvironment.value, projectId },
          include: {
            apiKey: {
              select: {
                token: true,
              },
            },
          },
        })
      : undefined;

    // @TODO - Handle scenario where no environment is found
    if (!environment) {
      return {
        success: false,
        error: "No active environment found",
        data: undefined,
      };
    }

    const apiKey = environment.apiKey;

    if (!apiKey) {
      return {
        success: false,
        error: "No active API key found for this project",
        data: undefined,
      };
    }

    // Fetch metrics from Tinybird
    const metrics = await getFunnelStepMetricsFromWorker(
      funnel.slug,
      apiKey.token,
      from,
      to,
    );

    return {
      success: true,
      data: metrics,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Error fetching funnel step metrics:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch funnel step metrics",
      data: undefined,
    };
  }
}

export async function getFlowSummaryByFunnel(params: FunnelMetricsParams) {
  try {
    const { funnelId, projectId, from, to } = params;

    // Validate user and access
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
        error: "User not found",
        data: undefined,
      };
    }

    const hasAccess = await hasProjectAccess(user.id, projectId);
    if (!hasAccess) {
      return {
        success: false,
        error: "Access denied to this project",
        data: undefined,
      };
    }

    // Get project and funnel details
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      select: { slug: true },
    });

    if (!funnel) {
      return {
        success: false,
        error: "Funnel not found",
        data: undefined,
      };
    }

    const activeEnvironment = (await cookies()).get("mode");
    const environment = activeEnvironment?.value
      ? await db.environment.findFirstOrThrow({
          where: { slug: activeEnvironment.value, projectId },
          include: {
            apiKey: {
              select: {
                token: true,
              },
            },
          },
        })
      : undefined;

    // @TODO - Handle scenario where no environment is found

    if (!environment) {
      return {
        success: false,
        error: "No active environment found",
        data: undefined,
      };
    }

    const apiKey = environment.apiKey;

    if (!apiKey) {
      return {
        success: false,
        error: "No active API key found for this project",
        data: undefined,
      };
    }

    const flowSummary = await getFlowSummaryByFunnelFromWorker(
      funnel.slug,
      apiKey.token,
      from,
      to,
    );

    if (flowSummary && flowSummary.length > 0) {
      return {
        success: true,
        data: flowSummary[0],
        error: undefined,
      };
    }

    return {
      success: true,
      data: flowSummary,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Error fetching flow summary by funnel:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch flow summary by funnel",
      data: undefined,
    };
  }
}

export async function getFunnelLastStepDropoffs(params: FunnelMetricsParams) {
  try {
    const { funnelId, projectId, from, to } = params;

    // Validate user and access
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
        error: "User not found",
        data: undefined,
      };
    }

    const hasAccess = await hasProjectAccess(user.id, projectId);
    if (!hasAccess) {
      return {
        success: false,
        error: "Access denied to this project",
        data: undefined,
      };
    }

    // Get project and funnel details
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      select: { slug: true },
    });

    if (!funnel) {
      return {
        success: false,
        error: "Funnel not found",
        data: undefined,
      };
    }
    const activeEnvironment = (await cookies()).get("mode");
    const environment = activeEnvironment?.value
      ? await db.environment.findFirstOrThrow({
          where: { slug: activeEnvironment.value, projectId },
          include: {
            apiKey: {
              select: {
                token: true,
              },
            },
          },
        })
      : undefined;

    // @TODO - Handle scenario where no environment is found

    if (!environment) {
      return {
        success: false,
        error: "No active environment found",
        data: undefined,
      };
    }

    const apiKey = environment.apiKey;

    if (!apiKey) {
      return {
        success: false,
        error: "No active API key found for this project",
        data: undefined,
      };
    }
    const funnelLastStepDropoffs = await getFunnelLastStepDropoffsFromWorker(
      funnel.slug,
      apiKey.token,
      from,
      to,
    );

    return {
      success: true,
      data: funnelLastStepDropoffs,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Error fetching flow summary by funnel:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch flow summary by funnel",
      data: undefined,
    };
  }
}

export async function getFunnelDropoffsByStep(
  params: FunnelMetricsParams & { stepId: string },
) {
  try {
    const { funnelId, projectId, from, to, stepId } = params;

    // Validate user and access
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
        error: "User not found",
        data: undefined,
      };
    }

    const hasAccess = await hasProjectAccess(user.id, projectId);
    if (!hasAccess) {
      return {
        success: false,
        error: "Access denied to this project",
        data: undefined,
      };
    }

    // Get project and funnel details
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      select: { slug: true },
    });

    if (!funnel) {
      return {
        success: false,
        error: "Funnel not found",
        data: undefined,
      };
    }

    const activeEnvironment = (await cookies()).get("mode");

    const apiKey = await db.apiKey.findFirst({
      where: {
        projectId,
        environment: {
          some: { slug: activeEnvironment?.value },
        },
      },
    });

    if (!apiKey) {
      return {
        success: false,
        error: "No active API key found for this project",
        data: undefined,
      };
    }

    const funnelLastStepDropoffs = await getFunnelDropoffsByStepFromWorker(
      funnel.slug,
      apiKey.token,
      from,
      to,
      stepId,
    );

    return {
      success: true,
      data: funnelLastStepDropoffs,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Error fetching flow summary by funnel:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch flow summary by funnel",
      data: undefined,
    };
  }
}
