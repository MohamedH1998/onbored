import FunnelContainer from "@/containers/funnel";
import React from "react";
import { redirect } from "next/navigation";
import { getFunnel } from "@/utils/queries/funnels";
import FunnelGuide from "@/containers/funnel/guide";
import { Calendar } from "@/components/calendar";

import { parseValidatedDateRange } from "@/utils/helpers";
import {
  generateActionableInsights,
  generateStats,
  getStepsData,
} from "./data";
import {
  getFlowSummaryByFunnel,
  getFunnelLastStepDropoffs,
  getFunnelStepMetrics,
} from "@/utils/queries/funnels/funnel-metrics";
import { ActionableInsight } from "@/typings";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; funnelId: string }>;
  searchParams: Promise<{ dateRange?: string }>;
}) => {
  const { projectId, funnelId } = await params;
  const { dateRange } = await searchParams;

  const { from, to } = parseValidatedDateRange(dateRange);

  const { data: funnel } = await getFunnel({ funnelId, projectId });

  if (!funnel) redirect(`/project/${projectId}`);

  const [funnelStepMetrics, funnelSummary, funnelLastStepDropoffs] =
    await Promise.all([
      getFunnelStepMetrics({
        funnelId,
        projectId,
        from,
        to,
      }),
      getFlowSummaryByFunnel({
        funnelId,
        projectId,
        from,
        to,
      }),
      getFunnelLastStepDropoffs({
        funnelId,
        projectId,
        from,
        to,
      }),
    ]);

  if (!funnelStepMetrics.success || !funnelSummary.success) {
    return <div>Error fetching funnel metrics</div>;
  }

  const { stepData, nodes, links } = getStepsData({
    funnelSteps: funnel.steps,
    funnelStepMetrics: funnelStepMetrics.data,
  });

  const stats = generateStats(funnelSummary.data);

  const actionableInsights = await generateActionableInsights({
    metrics: funnelStepMetrics.data,
    dropOffs: funnelLastStepDropoffs.data,
  });

  return (
    <div className="flex flex-col gap-8 pt-8">
      <div className="flex justify-between items-center px-14">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {funnel.name}
          </h1>
          <p className="text-xs text-muted-foreground py-1 flex items-center h-fit px-3 font-mono bg-zinc-100 rounded-sm w-fit">
            {funnel.slug}
          </p>
        </div>
        <div className="flex gap-2">
          <FunnelGuide funnel={funnel} />
          <Calendar />
        </div>
      </div>
      <FunnelContainer
        stats={stats}
        stepData={stepData}
        actionableInsightItems={actionableInsights as ActionableInsight[]}
        sankeyData={{
          nodes,
          links,
        }}
      />
    </div>
  );
};

export default Page;
