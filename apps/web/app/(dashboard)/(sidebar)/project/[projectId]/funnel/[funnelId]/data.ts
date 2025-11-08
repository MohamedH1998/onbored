import { FunnelStep } from "@repo/database";

interface FunnelStepMetric {
  step: string;
  views: number;
  skips: number;
  completions: number;
}

export const getStepsData = ({
  funnelSteps,
  funnelStepMetrics,
}: {
  funnelSteps: FunnelStep[];
  funnelStepMetrics: FunnelStepMetric[];
}) => {
  const stepData = funnelSteps.map((step) => {
    const metrics = funnelStepMetrics.find((m) => m.step === step.key) || {
      views: 0,
      skips: 0,
      completions: 0,
    };

    const dropOffRate = metrics.views > 0 ? metrics.skips / metrics.views : 0;

    return {
      name: step.stepName,
      views: metrics.views,
      skips: metrics.skips,
      completions: metrics.completions,
      dropOffRate,
      avgDuration: null,
    };
  });

  const nodes = [
    { name: "Start" },
    ...funnelSteps.map((step) => ({ name: step.stepName })),
  ];

  const links = [];

  const firstStepMetrics = funnelStepMetrics.find(
    (m) => m.step === funnelSteps[0]?.key,
  );
  const startValue = firstStepMetrics?.views || 0;
  links.push({ source: 0, target: 1, value: startValue });

  for (let i = 1; i < funnelSteps.length - 1; i++) {
    const currentStep = funnelSteps[i];

    const currentMetrics = funnelStepMetrics.find(
      (m) => m.step === currentStep.key,
    );

    const value = currentMetrics?.completions || 0;
    links.push({ source: i, target: i + 1, value });
  }

  const lastStep = funnelSteps[funnelSteps.length - 1];
  const lastStepMetrics = funnelStepMetrics.find(
    (m) => m.step === lastStep.key,
  );
  const lastStepCompletions = lastStepMetrics?.completions || 0;
  links.push({
    source: funnelSteps.length - 1,
    target: funnelSteps.length,
    value: lastStepCompletions,
  });

  return { stepData, nodes, links };
};

export const generateActionableInsights = async ({
  metrics,
  dropOffs,
}: {
  metrics: {
    step: string;
    views: number;
    skips: number;
    completions: number;
  }[];
  dropOffs: {
    funnel_slug: string;
    step_id: string;
    drop_offs: number;
  }[];
}) => {
  return dropOffs.map((candidate) => {
    const metric = metrics.find((metric) => metric.step === candidate.step_id);
    const views = metric?.views || 0;
    const completions = metric?.completions || 0;

    const stepCompletionRate = views > 0 ? completions / views : 0;

    const inStepFailures = views - completions;

    const postCompletionAbandonment = Math.max(
      0,
      candidate.drop_offs - inStepFailures,
    );

    const total = completions + candidate.drop_offs;
    const funnelDropOffRate = total > 0 ? candidate.drop_offs / total : 0;

    const hasStepCompletionIssue =
      stepCompletionRate < 0.5 && views > 0 && inStepFailures > 0;
    const hasPostCompletionAbandonmentIssue = postCompletionAbandonment > 0;

    let title: string;
    let subtitle: string;
    let actionPrompt: string;
    let suggestedActions: string[] = [];

    const dropOffRate =
      (candidate.drop_offs / (completions + candidate.drop_offs)) * 100;

    if (hasStepCompletionIssue && hasPostCompletionAbandonmentIssue) {
      title = `${candidate.step_id} - ${dropOffRate.toFixed(2)}% dropped`;
      subtitle = `${inStepFailures} can't complete, ${postCompletionAbandonment} leave after`;
      actionPrompt = `Fix step UX and improve progression to next step.`;
    } else if (hasStepCompletionIssue) {
      title = `${candidate.step_id} - ${dropOffRate.toFixed(2)}% dropped`;
      subtitle = `${(stepCompletionRate * 100).toFixed(0)}% completion rate`;
      actionPrompt = `Check UX, validation, or technical errors blocking completion.`;
    } else if (hasPostCompletionAbandonmentIssue) {
      title = `${candidate.step_id} - ${dropOffRate.toFixed(2)}% dropped`;
      subtitle = `Most complete step, but dropp off after completing: ${postCompletionAbandonment} of ${completions} don't continue`;
      actionPrompt = `Improve the next step button or add a progress indicator.`;
    } else {
      title = `${candidate.step_id} - ${dropOffRate.toFixed(2)}% dropped`;
      subtitle = `${(funnelDropOffRate * 100).toFixed(0)}% make this their last step`;
      actionPrompt = `Monitor for patterns.`;
      suggestedActions = [];
    }

    return {
      title,
      subtitle,
      key: "dropoff",
      category: "dropoff" as const,
      severity:
        hasStepCompletionIssue && hasPostCompletionAbandonmentIssue
          ? "high"
          : funnelDropOffRate >= 0.3
            ? "high"
            : funnelDropOffRate >= 0.1
              ? "medium"
              : "low",
      stepName: candidate.step_id,
      actionPrompt,
      generatedAt: new Date().toISOString(),
      score: funnelDropOffRate,
      replayQuery: { step: candidate.step_id },
    };
  });
};

export const generateStats = (stats: {
  completed: number;
  started: number;
  avg_completion_ms: number;
}) => {
  const completionRate =
    stats.started > 0 ? stats.completed / stats.started : 0;
  const completionRatePercentage =
    completionRate > 0 ? `${(completionRate * 100).toFixed(2)}%` : "-";
  return [
    {
      title: "Completion Rate",
      value: completionRatePercentage,
      iconKey: "users",
    },
    {
      title: "Time to Complete",
      value: `${(stats.avg_completion_ms / 1000).toFixed(2) || 0}s`,
      iconKey: "clock",
    },
    { title: "Started", value: stats.started, iconKey: "users" },
    { title: "Completed", value: stats.completed, iconKey: "users" },
  ];
};
