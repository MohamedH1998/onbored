"use server";

import {
  createSessionInsight,
  getSessionReplayInsight,
} from "@/utils/queries/session-insights";
import { getFunnelSteps } from "@/utils/queries/funnel-steps";
import { z } from "zod";
import { SessionInsight } from "@repo/database";
import { transformToSemanticInteractions } from "@/lib/session-replay/session-parser";
import { generateAISessionInsight } from "@/lib/ai";

export async function processSessionRecording({
  projectId,
  sessionId,
  sessionReplay,
  funnelId,
}: {
  projectId: string;
  sessionId: string;
  sessionReplay: any;
  funnelId: string;
}): Promise<{
  success: boolean;
  data?: SessionInsight | null;
  error?: unknown;
}> {
  try {
    const { success: sessionInsightSuccess, data: sessionInsight } =
      await getSessionReplayInsight({
        sessionReplayId: sessionId,
      });

    if (sessionInsightSuccess && sessionInsight) {
      return { success: true, data: sessionInsight };
    }

    const { timestampedSummary } =
      transformToSemanticInteractions(sessionReplay);

    const funnelSteps = await getFunnelSteps(funnelId);
    const transformedFunnelSteps = funnelSteps.map((step) => ({
      name: step.stepName,
      key: step.key,
      order: step.order,
      metadata: step.metadata,
    }));

    const insights = await generateAISessionInsight({
      funnelName: "Onboarding",
      capturedEvents: sessionReplay,
      timstampedSummary: timestampedSummary,
      funnelSteps: transformedFunnelSteps,
    });

    if (!insights) {
      return { success: false, data: null };
    }

    const { success: createInsightSuccess, data: insight } =
      await createSessionInsight({
        ...insights,
        sessionId,
        projectId,
        timestamp: new Date(insights.timestamp),
      } as SessionInsight);

    return { success: createInsightSuccess, data: insight };
  } catch (err) {
    console.error("❌ - Failed to process session", err);
    return { success: false, error: err };
  }
}
