"use server";

import { db } from "@repo/database";

export async function getFlowPathInsights({
  projectId,
  funnelId,
}: {
  projectId: string;
  funnelId: string;
}) {
  const insights = await db.flowPathInsight.findMany({
    where: {
      projectId,
      funnelId,
    },
    orderBy: { updatedAt: "desc" },
  });

  return insights;
}
