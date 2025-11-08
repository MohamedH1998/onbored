export interface FunnelStep {
  id: string;
  title: string;
  order: number;
  key: string;
}

export interface FunnelData {
  name: string;
  steps: FunnelStep[];
  activation?: {
    type: "step" | "custom";
    stepKey?: string;
    customEventName?: string;
  };
}

export const normalizeStepKey = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const isKeyUnique = (
  key: string,
  steps: FunnelStep[],
  excludeStepId?: string,
): boolean => {
  return !steps.some((step) => step.key === key && step.id !== excludeStepId);
};

export const generateUniqueKey = (
  baseKey: string,
  steps: FunnelStep[],
  excludeStepId?: string,
): string => {
  let uniqueKey = baseKey;
  let counter = 1;

  while (!isKeyUnique(uniqueKey, steps, excludeStepId)) {
    uniqueKey = `${baseKey}-${counter}`;
    counter++;
  }

  return uniqueKey;
};
