"use server";

import { db, FunnelStep } from "@repo/database";

export const getFunnelSteps = async (
  funnelId: string,
): Promise<FunnelStep[]> => {
  try {
    const steps = await db.funnelStep.findMany({
      where: { funnelId },
    });
    return steps;
  } catch (error) {
    console.error("❌ - Failed to get funnel steps", error);
    return [];
  }
};
