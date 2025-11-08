"use server";

import { getCurrentUser, hasProjectAccess } from "@/utils/auth-helpers";
import { db, SessionInsight } from "@repo/database";

export const createSessionInsight = async (
  sessionInsight: SessionInsight,
): Promise<{ success: boolean; data?: SessionInsight; error?: unknown }> => {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return { success: false, error: "Unauthorized", data: undefined };
    }
    const user = userResult.data;
    if (!user) {
      return { success: false, error: "User not found", data: undefined };
    }
    const hasAccess = await hasProjectAccess(user.id, sessionInsight.projectId);
    if (!hasAccess.success) {
      return { success: false, error: hasAccess.error, data: undefined };
    }
    const insight = await db.sessionInsight.create({
      data: {
        sessionId: sessionInsight.sessionId,
        projectId: sessionInsight.projectId,
        description: sessionInsight.description,
        timestamp: sessionInsight.timestamp,
        insightType: sessionInsight.insightType,
        metadata: sessionInsight.metadata as any,
        actionableRecommendation: sessionInsight.actionableRecommendation,
        severity: sessionInsight.severity,
        confidence: sessionInsight.confidence,
        userBehaviorSummary: sessionInsight.userBehaviorSummary,
        signals: sessionInsight.signals,
        funnelStep: sessionInsight.funnelStep,
      },
    });
    return { success: true, data: insight, error: undefined };
  } catch (err) {
    console.error("❌ - Failed to create session replay insight", err);
    return { success: false, error: err, data: undefined };
  }
};

export const getSessionReplayInsight = async ({
  sessionReplayId,
}: {
  sessionReplayId: string;
}): Promise<{ success: boolean; data?: SessionInsight; error?: unknown }> => {
  try {
    const insight = await db.sessionInsight.findFirst({
      where: { sessionId: sessionReplayId },
    });
    return { success: true, data: insight || undefined, error: undefined };
  } catch (err) {
    console.error("❌ - Failed to get session insight", err);
    return { success: false, error: err, data: undefined };
  }
};
