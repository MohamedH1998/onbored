import { google } from "@ai-sdk/google";
import { InsightType } from "@repo/database";
import { generateObject } from "ai";
import { z } from "zod";
import { generateSessionReplayPrompt } from "./prompts";

const aiSessionInsightSchema = z.object({
  description: z.string().min(20),
  actionableRecommendation: z.string().optional(),
  severity: z.enum(["low", "medium", "high"]).default("medium"),
  confidence: z.number().min(0).max(1), // AI self-assessment of certainty
  insightType: z.nativeEnum(InsightType),
  userBehaviorSummary: z.string(),
  timestamp: z.number(),
  signals: z.array(
    z.enum(["confusion", "frustration", "hesitation", "drop-off", "delight"]),
  ),
  metadata: z.record(z.string(), z.any()),
});

export const generateAISessionInsight = async ({
  funnelName,
  capturedEvents,
  timstampedSummary,
  funnelSteps,
}: {
  funnelName: string;
  capturedEvents: {
    id: string;
    eventType: string;
    timestamp: string;
    url: string;
    metadata: Record<string, any>;
    step?: string;
  }[];
  timstampedSummary: string;
  funnelSteps: { name: string; key: string; order: number; metadata: any }[];
}) => {
  try {
    const prompt = generateSessionReplayPrompt({
      funnelName,
      capturedEvents,
      timstampedSummary,
      funnelSteps,
    });

    const result = await generateObject({
      model: google("gemini-2.5-flash", {
        structuredOutputs: false,
      }),
      schema: aiSessionInsightSchema,
      prompt: prompt,
    });
    return result.object;
  } catch (error) {
    console.error(error);
    return null;
  }
};
