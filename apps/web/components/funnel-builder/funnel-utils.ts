import { FunnelStep } from "./types";

export const normalizeStepKey = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const generateUniqueKey = (
  baseKey: string,
  steps: FunnelStep[],
  excludeStepId?: string
): string => {
  let uniqueKey = baseKey;
  let counter = 1;
  while (
    steps.some((step) => step.key === uniqueKey && step.id !== excludeStepId)
  ) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }
  return uniqueKey;
};

export const transformFunnelSteps = (funnel?: {
  steps: Array<{
    id: string;
    stepName: string;
    order: number;
    key: string;
  }>;
}): FunnelStep[] => {
  if (!funnel) return [];
  return funnel.steps
    .map((step) => ({
      id: step.id,
      title: step.stepName,
      order: step.order,
      key: step.key,
    }))
    .sort((a, b) => a.order - b.order);
};
