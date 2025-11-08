"use server";

import { db } from "@repo/database";
import { getSessionReplayFromWorker } from "@/lib/analytics/client";
import { getCurrentUser, hasProjectAccess } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export const getSessionReplay = async ({
  id,
  projectId,
  funnelId,
}: {
  id: string;
  projectId: string;
  funnelId: string;
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
        error: "User not found",
        data: undefined,
      };
    }

    const hasAccess = await hasProjectAccess(user.id, projectId);
    if (!hasAccess.success) {
      return {
        success: false,
        error: "Access denied to this project",
        data: undefined,
      };
    }

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
        environment: { some: { slug: activeEnvironment?.value } },
      },
    });

    if (!apiKey) {
      return {
        success: false,
        error: "No active API key found for this project",
        data: undefined,
      };
    }

    const sessionReplay = await getSessionReplayFromWorker(id, apiKey.token);

    if (!sessionReplay.length) {
      return {
        success: false,
        error: "Session replay not found",
        data: undefined,
      };
    }

    return { success: true, data: sessionReplay[0], error: undefined };
  } catch (err) {
    console.error("❌ - Failed to get session replay", err);
    return { success: false, error: err, data: undefined };
  }
};
