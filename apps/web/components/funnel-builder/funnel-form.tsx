"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { BellPlus, ShoppingBasket, Send } from "lucide-react";
import { cn, generateSlug } from "@/utils/helpers";
import { upsertFunnel } from "@/utils/queries/funnels";
import { FunnelStatus } from "@repo/database";
import { SortableStep } from "./sortable-step";
import { FunnelStep } from "./types";

const normalizeStepKey = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const generateUniqueKey = (
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

interface FunnelFormProps {
  projectId: string;
  workspaceMemberId: string;
  initialName?: string;
  initialSteps?: FunnelStep[];
  initialActivation?: { type: "step" | "custom"; stepKey?: string; customEventName?: string };
  isOnboarding?: boolean;
  size?: "sm" | "md";
  showNameInput?: boolean;
  nameDisabled?: boolean;
  namePlaceholder?: string;
  disabled?: boolean;
  onSaved?: () => void;
  onPublished?: () => void;
}

export interface FunnelFormRef {
  saveAsDraft: () => Promise<void>;
  publishFunnel: () => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
}

export const FunnelForm = forwardRef<FunnelFormRef, FunnelFormProps>(({
  projectId,
  workspaceMemberId,
  initialName = "",
  initialSteps = [],
  initialActivation,
  isOnboarding = false,
  size = "md",
  showNameInput = true,
  nameDisabled = false,
  namePlaceholder = "Enter funnel name...",
  disabled = false,
  onSaved,
  onPublished,
}, ref) => {
  const [name, setName] = useState(initialName);
  const [steps, setSteps] = useState<FunnelStep[]>(initialSteps);
  const [activation, setActivation] = useState(initialActivation);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const router = useRouter();
  const isSmall = size === "sm";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addStep = useCallback(() => {
    const stepTitle = `Step ${steps.length + 1}`;
    const normalizedKey = normalizeStepKey(stepTitle);
    const uniqueKey = generateUniqueKey(normalizedKey, steps);

    const newStep: FunnelStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: stepTitle,
      order: steps.length + 1,
      key: uniqueKey,
    };

    setSteps([...steps, newStep]);

    if (isOnboarding && !activation) {
      setActivation({ type: "step", stepKey: newStep.key });
    }

    toast.success("Step added");
  }, [steps, activation, isOnboarding]);

  const updateStep = useCallback(
    (stepId: string, title: string) => {
      const normalizedKey = normalizeStepKey(title);
      const uniqueKey = generateUniqueKey(normalizedKey, steps, stepId);

      const existingStepWithSameKey = steps.find(
        (step) => step.key === normalizedKey && step.id !== stepId
      );

      if (existingStepWithSameKey) {
        toast.error(
          `A step with the title "${existingStepWithSameKey.title}" already exists. Please use a different title.`
        );
        return;
      }

      const updatedSteps = steps.map((step) =>
        step.id === stepId ? { ...step, title, key: uniqueKey } : step
      );

      setSteps(updatedSteps);

      if (activation?.type === "step") {
        const wasTarget = steps.find((s) => s.id === stepId);
        if (wasTarget && activation.stepKey === wasTarget.key) {
          setActivation({ ...activation, stepKey: uniqueKey });
        }
      }
    },
    [steps, activation]
  );

  const deleteStep = useCallback(
    (stepId: string) => {
      const deleted = steps.find((s) => s.id === stepId);
      const updatedSteps = steps
        .filter((step) => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index + 1 }));

      setSteps(updatedSteps);

      if (deleted && activation?.type === "step" && activation.stepKey === deleted.key) {
        if (updatedSteps.length > 0) {
          setActivation({
            type: "step",
            stepKey: updatedSteps[updatedSteps.length - 1].key,
          });
        } else {
          setActivation(undefined);
        }
      }

      toast.success("Step removed");
    },
    [steps, activation]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over?.id);

      const newSteps = arrayMove(steps, oldIndex, newIndex);
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        order: index + 1,
      }));

      setSteps(updatedSteps);
      toast.success("Steps reordered");
    }
  };

  const validateForm = useCallback(() => {
    if (!name.trim()) {
      toast.error("Please enter a funnel name");
      return false;
    }
    if (steps.length === 0) {
      toast.error("Please add at least one step");
      return false;
    }
    if (steps.some((step) => !step.title.trim())) {
      toast.error("All steps must have titles");
      return false;
    }

    const keys = steps.map((step) => step.key);
    const uniqueKeys = new Set(keys);
    if (keys.length !== uniqueKeys.size) {
      toast.error("Duplicate step titles detected. Please ensure all steps have unique titles.");
      return false;
    }

    return true;
  }, [name, steps]);

  const saveAsDraft = useCallback(async () => {
    console.log("🟣 - saveAsDraft");
    if (!validateForm()) {
      console.log("🟣 - validateForm", validateForm());
      return;
    };

    setIsSaving(true);
    try {
      const lastStepKey = steps[steps.length - 1]?.key ?? undefined;
      const resolvedActivation = activation ?? (lastStepKey ? { type: "step", stepKey: lastStepKey } : undefined);

      const activationRules = resolvedActivation
        ? [{
            stepName: resolvedActivation.type === "step" ? resolvedActivation.stepKey : undefined,
            eventName: resolvedActivation.type === "custom" ? resolvedActivation.customEventName?.trim() : undefined,
          }]
        : [];

      const funnel = await upsertFunnel({
        funnel: {
          name,
          slug: generateSlug(name),
          steps: steps.map((step) => ({
            order: step.order,
            stepName: step.title,
            key: step.key,
          })),
          activationRules,
          status: FunnelStatus.DRAFT,
        },
        projectId,
      });

      if (!funnel.success || !funnel.data) {
        toast.error(funnel.error);
        return;
      }

      toast.success("Draft saved successfully");
      onSaved?.();
      router.push(`/project/${projectId}/funnel/new?funnelId=${funnel.data?.id}`);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  }, [name, steps, activation, projectId, validateForm, router, onSaved]);

  const publishFunnel = useCallback(async () => {
    if (!validateForm()) return;

    if (isOnboarding && !activation) {
      toast.error("Please define at least one activation moment before publishing.");
      return;
    }

    if (activation?.type === "step") {
      const exists = steps.some((s) => s.key === activation.stepKey);
      if (!exists) {
        const lastStep = steps[steps.length - 1];
        if (lastStep) {
          setActivation({ type: "step", stepKey: lastStep.key });
          toast.message("Activation updated to last step.", {
            description: "Your previous activation step no longer exists.",
          });
        } else {
          toast.error("Please add a step or set a custom activation event.");
          return;
        }
      }
    } else if (activation?.type === "custom" && !(activation.customEventName || "").trim()) {
      toast.error("Please enter a custom activation event name.");
      return;
    }

    setIsPublishing(true);
    try {
      const resolvedActivation = (() => {
        if (!activation) return undefined;
        if (activation.type === "step") {
          const step = steps.find((s) => s.key === activation.stepKey);
          if (!step) return undefined;
          return { stepName: step.title, stepKey: step.key };
        }
        return { customEventName: activation.customEventName?.trim() };
      })();

      if (isOnboarding && !resolvedActivation) {
        toast.error("Please define a valid activation moment.");
        return;
      }

      const activationRules = resolvedActivation
        ? [{
            stepName: resolvedActivation.stepKey,
            eventName: resolvedActivation.customEventName,
          }]
        : [];

      const funnel = await upsertFunnel({
        funnel: {
          name,
          slug: generateSlug(name),
          steps: steps.map((step) => ({
            order: step.order,
            stepName: step.title,
            key: step.key,
          })),
          activationRules,
          status: FunnelStatus.PUBLISHED,
        },
        projectId,
      });

      if (!funnel.success || !funnel.data) {
        toast.error(funnel.error);
        return;
      }

      onPublished?.();
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
  }, [name, steps, activation, projectId, isOnboarding, validateForm, router, onPublished]);

  const activeStep = activeId ? steps.find((step) => step.id === activeId) : null;

  useImperativeHandle(ref, () => ({
    saveAsDraft,
    publishFunnel,
    isSaving,
    isPublishing,
  }));

  return (
    <div className="w-full space-y-8">
      {showNameInput && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-2"
        >
          <label className={cn("font-medium text-foreground", isSmall ? "text-xs" : "text-sm")}>
            Funnel name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={nameDisabled || disabled}
            placeholder={namePlaceholder}
            className={cn(isSmall ? "h-8 text-sm" : "h-9")}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className={cn("font-semibold text-foreground", isSmall ? "text-sm" : "text-base")}>
              Steps
            </h2>
            <p className={cn("text-muted-foreground", isSmall ? "text-[10px]" : "text-xs")}>
              {steps.length} step{steps.length !== 1 ? "s" : ""} • Drag to reorder
            </p>
          </div>
          <Button
            onClick={addStep}
            size="sm"
            className={cn(isSmall ? "h-7 px-2" : "h-8 px-3")}
            disabled={disabled}
          >
            <Plus className={cn("mr-1.5", isSmall ? "w-3 h-3" : "w-4 h-4")} />
            {isSmall ? "Add step" : "Add Step"}
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={steps.map((step) => step.id)}>
            <div
              className={cn(
                "relative overflow-hidden border-2 border-dashed transition-all duration-300",
                isSmall ? "rounded-lg" : "rounded-xl",
                steps.length > 0
                  ? "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
                  : "border-muted-foreground/20 bg-muted/30",
                steps.length === 0 && "min-h-[200px] flex items-center justify-center"
              )}
            >
              {steps.length === 0 ? (
                <EmptyState
                  title="Create Your First Step"
                  description="Start building your funnel by adding steps that guide users through your process"
                  icons={[BellPlus, ShoppingBasket, Send]}
                  className="text-center py-12 px-6 bg-zinc-50"
                />
              ) : (
                <div className={cn("space-y-2", isSmall ? "p-2" : "p-3")}>
                  <AnimatePresence mode="popLayout">
                    {steps.map((step) => (
                      <SortableStep
                        key={step.id}
                        step={step}
                        onDelete={deleteStep}
                        onUpdate={updateStep}
                        isDragging={activeId === step.id}
                        size={size}
                        disabled={disabled}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={true} dropAnimation={null}>
            {activeId && activeStep && (
              <SortableStep
                step={activeStep}
                onDelete={() => {}}
                onUpdate={() => {}}
                disabled={true}
                isDragging={true}
                size={size}
              />
            )}
          </DragOverlay>
        </DndContext>
      </motion.div>

      {isOnboarding && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <div className="space-y-0.5">
            <h2 className={cn("font-semibold flex items-center gap-2", isSmall ? "text-sm" : "text-base")}>
              Activation moment
            </h2>
            <p className={cn("text-muted-foreground", isSmall ? "text-[10px]" : "text-xs")}>
              The moment users first experience value. Used for retention and alerts.
            </p>
          </div>

          <div className={cn("border space-y-3", isSmall ? "rounded-lg p-3" : "rounded-xl p-4")}>
            <div className="flex flex-row gap-2">
              <Button
                type="button"
                variant={activation?.type !== "custom" ? "default" : "outline"}
                className={cn(isSmall ? "h-7 px-2 text-xs" : "h-8 px-3")}
                onClick={() => {
                  const lastKey = steps[steps.length - 1]?.key;
                  setActivation({
                    type: "step",
                    stepKey: activation?.type === "step" ? activation.stepKey : lastKey,
                  });
                }}
                disabled={disabled}
              >
                Choose a step
              </Button>
              <Button
                type="button"
                variant={activation?.type === "custom" ? "default" : "outline"}
                className={cn(isSmall ? "h-7 px-2 text-xs" : "h-8 px-3")}
                onClick={() => {
                  setActivation({
                    type: "custom",
                    customEventName: activation?.type === "custom" ? activation.customEventName : "",
                  });
                }}
                disabled={disabled}
              >
                Custom event
              </Button>
            </div>

            <AnimatePresence initial={false} mode="wait">
              {activation?.type !== "custom" && (
                <motion.div
                  key="step-select"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  {steps.length === 0 ? (
                    <p className={cn("text-muted-foreground", isSmall ? "text-xs" : "text-sm")}>
                      Add steps to choose your activation moment.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-2">
                      {steps.map((s) => {
                        const selected =
                          activation?.stepKey === s.key ||
                          (!activation && s.order === steps.length);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setActivation({ type: "step", stepKey: s.key });
                            }}
                            disabled={disabled}
                            className={cn(
                              "w-full border rounded-md text-left hover:bg-accent transition",
                              isSmall ? "px-2 py-1.5" : "px-3 py-2",
                              selected ? "border-primary bg-primary/5" : "border-border",
                              disabled && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className={cn("font-medium", isSmall ? "text-xs" : "text-sm")}>
                                {s.title}
                              </span>
                              {selected && (
                                <Badge
                                  variant="secondary"
                                  className={cn(isSmall ? "text-[9px] h-4" : "text-[10px] h-5")}
                                >
                                  Selected
                                </Badge>
                              )}
                            </div>
                            <p className={cn("text-muted-foreground mt-1", isSmall ? "text-[10px]" : "text-xs")}>
                              Step {s.order}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activation?.type === "custom" && (
                <motion.div
                  key="custom-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className={cn("font-medium", isSmall ? "text-[10px]" : "text-xs")}>
                    Custom activation event
                  </label>
                  <Input
                    value={activation?.customEventName ?? ""}
                    onChange={(e) => {
                      setActivation({
                        type: "custom",
                        customEventName: e.target.value,
                      });
                    }}
                    placeholder='e.g. "invited_team_member" or "export_completed"'
                    className={cn(isSmall ? "h-8 text-xs" : "h-9")}
                    disabled={disabled}
                  />
                  <p className={cn("text-muted-foreground", isSmall ? "text-[9px]" : "text-[11px]")}>
                    Use the exact event name you track in your product.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

    </div>
  );
});

FunnelForm.displayName = "FunnelForm";
