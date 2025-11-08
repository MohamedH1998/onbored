"use client";

import { useState, useCallback } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { toast } from "sonner";
import { upsertFunnel } from "@/utils/queries/funnels";
import { FunnelStatus } from "@repo/database";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/utils/helpers";
import {
  FunnelData,
  FunnelStep,
  normalizeStepKey,
  generateUniqueKey,
} from "@/components/funnel-builder/types";

interface UseFunnelBuilderOptions {
  projectId: string;
  workspaceMemberId: string;
  initialData?: Partial<FunnelData>;
  isOnboarding?: boolean;
}

export const useFunnelBuilder = ({
  projectId,
  workspaceMemberId,
  initialData = {},
  isOnboarding = false,
}: UseFunnelBuilderOptions) => {
  const [funnelData, setFunnelData] = useState<FunnelData>({
    name: initialData.name || (isOnboarding ? "Onboarding" : ""),
    steps: initialData.steps || [],
    activation: initialData.activation,
  });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const router = useRouter();

  const addStep = useCallback(() => {
    const stepTitle = `Step ${funnelData.steps.length + 1}`;
    const normalizedKey = normalizeStepKey(stepTitle);
    const uniqueKey = generateUniqueKey(normalizedKey, funnelData.steps);

    const newStep: FunnelStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: stepTitle,
      order: funnelData.steps.length + 1,
      key: uniqueKey,
    };

    setFunnelData((prev) => {
      const nextSteps = [...prev.steps, newStep];
      const nextActivation =
        prev.activation?.type === "step"
          ? { ...prev.activation, stepKey: prev.activation.stepKey }
          : prev.activation;

      return {
        ...prev,
        steps: nextSteps,
        activation:
          nextActivation && nextActivation.type
            ? nextActivation
            : {
                type: "step",
                stepKey: newStep.key,
              },
      };
    });
    setHasUnsavedChanges(true);
    toast.success("Step added");
  }, [funnelData.steps.length, funnelData.steps]);

  const updateStep = useCallback(
    (stepId: string, title: string) => {
      const normalizedKey = normalizeStepKey(title);
      const uniqueKey = generateUniqueKey(
        normalizedKey,
        funnelData.steps,
        stepId,
      );

      const existingStepWithSameKey = funnelData.steps.find(
        (step) => step.key === normalizedKey && step.id !== stepId,
      );

      if (existingStepWithSameKey) {
        toast.error(
          `A step with the title "${existingStepWithSameKey.title}" already exists. Please use a different title.`,
        );
        return;
      }

      setFunnelData((prev) => {
        const updatedSteps = prev.steps.map((step) =>
          step.id === stepId ? { ...step, title, key: uniqueKey } : step,
        );

        let updatedActivation = prev.activation;
        if (prev.activation?.type === "step") {
          const wasTarget = prev.steps.find((s) => s.id === stepId);
          if (wasTarget && prev.activation.stepKey === wasTarget.key) {
            updatedActivation = { ...prev.activation, stepKey: uniqueKey };
          }
        }

        return {
          ...prev,
          steps: updatedSteps,
          activation: updatedActivation,
        };
      });
      setHasUnsavedChanges(true);
    },
    [funnelData.steps],
  );

  const deleteStep = useCallback(
    (stepId: string) => {
      setFunnelData((prev) => {
        const deleted = prev.steps.find((s) => s.id === stepId);
        const updatedSteps = prev.steps
          .filter((step) => step.id !== stepId)
          .map((step, index) => ({ ...step, order: index + 1 }));

        let updatedActivation = prev.activation;
        if (
          deleted &&
          prev.activation?.type === "step" &&
          prev.activation.stepKey === deleted.key
        ) {
          if (updatedSteps.length > 0) {
            updatedActivation = {
              type: "step",
              stepKey: updatedSteps[updatedSteps.length - 1].key,
            };
          } else {
            updatedActivation = undefined;
          }
        }

        return {
          ...prev,
          steps: updatedSteps,
          activation: updatedActivation,
        };
      });
      setHasUnsavedChanges(true);
    },
    [funnelData.steps],
  );

  const updateSteps = useCallback((steps: FunnelStep[]) => {
    setFunnelData((prev) => ({ ...prev, steps }));
    setHasUnsavedChanges(true);
  }, []);

  const updateActivation = useCallback(
    (activation: FunnelData["activation"]) => {
      setFunnelData((prev) => ({ ...prev, activation }));
      setHasUnsavedChanges(true);
    },
    [],
  );

  const updateName = useCallback((name: string) => {
    setFunnelData((prev) => ({ ...prev, name }));
    setHasUnsavedChanges(true);
  }, []);

  const validateForm = useCallback(() => {
    if (!funnelData.name.trim()) {
      toast.error("Please enter a funnel name");
      return false;
    }
    if (funnelData.steps.length === 0) {
      toast.error("Please add at least one step");
      return false;
    }
    if (funnelData.steps.some((step) => !step.title.trim())) {
      toast.error("All steps must have titles");
      return false;
    }

    const keys = funnelData.steps.map((step) => step.key);
    const uniqueKeys = new Set(keys);
    if (keys.length !== uniqueKeys.size) {
      toast.error(
        "Duplicate step titles detected. Please ensure all steps have unique titles.",
      );
      return false;
    }

    return true;
  }, [funnelData]);

  const saveAsDraft = useCallback(async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const lastStepKey =
        funnelData.steps[funnelData.steps.length - 1]?.key ?? undefined;

      const activation =
        funnelData.activation ??
        (lastStepKey ? { type: "step", stepKey: lastStepKey } : undefined);

      const funnel = await upsertFunnel({
        funnel: {
          name: funnelData.name,
          slug: generateSlug(funnelData.name),
          steps: funnelData.steps.map((step) => ({
            order: step.order,
            stepName: step.title,
            key: step.key,
          })),
          activationRule:
            activation?.type === "step"
              ? {
                  name: activation.stepKey || "",
                  type: "STEP",
                  stepName: activation.stepKey,
                }
              : activation?.type === "custom"
                ? {
                    name: activation.customEventName?.trim() || "",
                    type: "EVENT",
                    eventName: activation.customEventName?.trim() || "",
                  }
                : undefined,
          status: FunnelStatus.DRAFT,
        },
        projectId,
      });
      if (!funnel.success || !funnel.data) {
        toast.error(funnel.error);
        return;
      }
      setHasUnsavedChanges(false);
      toast.success("Draft saved successfully");
      router.push(
        `/project/${projectId}/funnel/new?funnelId=${funnel.data?.id}`,
      );
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  }, [funnelData, validateForm, projectId, workspaceMemberId, router]);

  const publishFunnel = useCallback(async () => {
    if (!validateForm()) return;

    const activation = funnelData.activation;
    const lastStep = funnelData.steps[funnelData.steps.length - 1];

    if (isOnboarding && !activation) {
      toast.error("Please define your activation moment before publishing.");
      return;
    }

    if (activation && activation.type === "step") {
      const exists = funnelData.steps.some((s) => s.key === activation.stepKey);
      if (!exists) {
        if (lastStep) {
          setFunnelData((prev) => ({
            ...prev,
            activation: { type: "step", stepKey: lastStep.key },
          }));
          toast.message("Activation updated to last step.", {
            description: "Your previous activation step no longer exists.",
          });
        } else {
          toast.error("Please add a step or set a custom activation event.");
          return;
        }
      }
    } else if (
      activation &&
      activation.type === "custom" &&
      !(activation.customEventName || "").trim()
    ) {
      toast.error("Please enter a custom activation event name.");
      return;
    }

    setIsPublishing(true);
    try {
      const resolvedActivation = (():
        | {
            stepName?: string;
            stepKey?: string;
            customEventName?: string;
          }
        | undefined => {
        if (!activation) return undefined;
        if (activation.type === "step") {
          const step = funnelData.steps.find(
            (s) => s.key === activation.stepKey,
          );
          if (!step) return undefined;
          return { stepName: step.title, stepKey: step.key };
        }
        return {
          customEventName: activation.customEventName?.trim(),
        };
      })();

      if (isOnboarding && !resolvedActivation) {
        toast.error("Please define a valid activation moment.");
        return;
      }

      const funnel = await upsertFunnel({
        funnel: {
          name: funnelData.name,
          slug: generateSlug(funnelData.name),
          steps: funnelData.steps.map((step) => ({
            order: step.order,
            stepName: step.title,
            key: step.key,
          })),
          activationRule: resolvedActivation
            ? {
                name:
                  resolvedActivation.stepKey ||
                  resolvedActivation.customEventName ||
                  "",
                type: resolvedActivation.stepKey ? "STEP" : "EVENT",
                stepName: resolvedActivation.stepKey,
                eventName: resolvedActivation.customEventName,
              }
            : undefined,
          status: FunnelStatus.PUBLISHED,
        },
        projectId,
      });
      if (!funnel.success || !funnel.data) {
        toast.error(funnel.error);
        return;
      }
      setHasUnsavedChanges(false);
      if (isOnboarding) {
        router.push(`/project/${projectId}/install`);
      } else {
        router.push(`/project/${projectId}/funnel/${funnel.data.id}`);
      }
    } catch (error) {
      console.error("Error publishing funnel:", error);
      toast.error("Failed to publish funnel");
    } finally {
      setIsPublishing(false);
    }
  }, [
    funnelData,
    validateForm,
    projectId,
    workspaceMemberId,
    router,
    isOnboarding,
  ]);

  return {
    funnelData,
    activeId,
    setActiveId,
    isSaving,
    isPublishing,
    hasUnsavedChanges,
    addStep,
    updateStep,
    deleteStep,
    updateSteps,
    updateActivation,
    updateName,
    saveAsDraft,
    publishFunnel,
  };
};
