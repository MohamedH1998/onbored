import { ONBOARDING_STEPS } from "@/data/constants";

export function getNextStep(lastCompletedStep: string | undefined): string {
  if (!lastCompletedStep) return ONBOARDING_STEPS[0];

  const index = ONBOARDING_STEPS.indexOf(lastCompletedStep);
  const next = ONBOARDING_STEPS[index + 1];

  return next || "/";
}
