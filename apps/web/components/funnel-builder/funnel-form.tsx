"use client";

import { useState, useCallback, useImperativeHandle, forwardRef, useEffect } from "react";
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
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { BellPlus, ShoppingBasket, Send } from "lucide-react";
import { cn, generateSlug } from "@/utils/helpers";
import { upsertFunnel } from "@/utils/queries/funnels";
import { FunnelStatus } from "@repo/database";
import { SortableStep } from "./sortable-step";
import { FunnelStep } from "./types";
import { normalizeStepKey, generateUniqueKey } from "./funnel-utils";

interface FunnelFormProps {
  projectId: string;
  workspaceMemberId: string;
  initialName?: string;
  initialSteps?: FunnelStep[];
  isOnboarding?: boolean;
  size?: "sm" | "md";
  showNameInput?: boolean;
  nameDisabled?: boolean;
  namePlaceholder?: string;
  disabled?: boolean;
  onSaved?: () => void;
  onPublished?: () => void;
  onSavingChange?: (isSaving: boolean) => void;
  onPublishingChange?: (isPublishing: boolean) => void;
}

export interface FunnelFormRef {
  saveAsDraft: () => Promise<void>;
  publishFunnel: () => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
}

export const FunnelForm = forwardRef<FunnelFormRef, FunnelFormProps>(
  (
    {
      projectId,
      workspaceMemberId,
      initialName = "",
      initialSteps = [],
      isOnboarding = false,
      size = "md",
      showNameInput = true,
      nameDisabled = false,
      namePlaceholder = "Enter funnel name...",
      disabled = false,
      onSaved,
      onPublished,
      onSavingChange,
      onPublishingChange,
    },
    ref
  ) => {
    const [name, setName] = useState(initialName);
    const [steps, setSteps] = useState<FunnelStep[]>(() => {
      if (initialSteps.length > 0) return initialSteps;

      if (isOnboarding) {
        const stepTitle = "Step 1";
        const normalizedKey = normalizeStepKey(stepTitle);
        return [{
          id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: stepTitle,
          order: 1,
          key: normalizedKey,
        }];
      }

      return [];
    });
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [focusStepId, setFocusStepId] = useState<string | null>(() =>
      isOnboarding && initialSteps.length === 0 ? steps[0]?.id ?? null : null
    );

    const router = useRouter();
    const isSmall = size === "sm";

    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
      useSensor(TouchSensor, {
        activationConstraint: { delay: 200, tolerance: 6 },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
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
      toast.success("Step added");
    }, [steps]);

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
      },
      [steps]
    );

    const deleteStep = useCallback(
      (stepId: string) => {
        const updatedSteps = steps
          .filter((step) => step.id !== stepId)
          .map((step, index) => ({ ...step, order: index + 1 }));

        setSteps(updatedSteps);
        toast.success("Step removed");
      },
      [steps]
    );

    const handleEnterPress = useCallback(
      (currentStepId: string) => {
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
        setFocusStepId(newStep.id);
        toast.success("Step added");
      },
      [steps]
    );

    useEffect(() => {
      if (focusStepId) {
        setFocusStepId(null);
      }
    }, [focusStepId]);

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
        toast.error(
          "Duplicate step titles detected. Please ensure all steps have unique titles."
        );
        return false;
      }

      return true;
    }, [name, steps]);

    const saveFunnel = useCallback(
      async (status: FunnelStatus) => {
        if (!validateForm()) return;

        const isDraft = status === FunnelStatus.DRAFT;
        if (isDraft) {
          setIsSaving(true);
          onSavingChange?.(true);
        } else {
          setIsPublishing(true);
          onPublishingChange?.(true);
        }

        try {
          const funnel = await upsertFunnel({
            funnel: {
              name,
              slug: generateSlug(name),
              steps: steps.map((step) => ({
                order: step.order,
                stepName: step.title,
                key: step.key,
              })),
              status,
            },
            projectId,
          });

          if (!funnel.success || !funnel.data) {
            toast.error(funnel.error);
            return;
          }

          if (isDraft) {
            toast.success("Draft saved successfully");
            onSaved?.();
            router.push(
              `/project/${projectId}/funnel/new?funnelId=${funnel.data?.id}`
            );
          } else {
            onPublished?.();
            if (isOnboarding) {
              router.push(`/project/${projectId}/install`);
            } else {
              router.push(`/project/${projectId}/funnel/${funnel.data.id}`);
            }
          }
        } catch (error) {
          toast.error(
            isDraft ? "Failed to save draft" : "Failed to publish funnel"
          );
        } finally {
          if (isDraft) {
            setIsSaving(false);
            onSavingChange?.(false);
          } else {
            setIsPublishing(false);
            onPublishingChange?.(false);
          }
        }
      },
      [
        name,
        steps,
        projectId,
        isOnboarding,
        validateForm,
        router,
        onSaved,
        onPublished,
        onSavingChange,
        onPublishingChange,
      ]
    );

    const saveAsDraft = useCallback(
      () => saveFunnel(FunnelStatus.DRAFT),
      [saveFunnel]
    );
    const publishFunnel = useCallback(
      () => saveFunnel(FunnelStatus.PUBLISHED),
      [saveFunnel]
    );

    const activeStep = activeId
      ? steps.find((step) => step.id === activeId)
      : null;

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
            <label
              className={cn(
                "font-medium text-foreground",
                isSmall ? "text-xs" : "text-sm"
              )}
            >
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
              <h2
                className={cn(
                  "font-semibold text-foreground",
                  isSmall ? "text-sm" : "text-base"
                )}
              >
                Steps
              </h2>
              <p
                className={cn(
                  "text-muted-foreground",
                  isSmall ? "text-[10px]" : "text-xs"
                )}
              >
                {steps.length} step{steps.length !== 1 ? "s" : ""} • Drag to
                reorder
              </p>
            </div>
 
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
                  steps.length === 0 &&
                    "min-h-[200px] flex items-center justify-center"
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
                          onEnterPress={handleEnterPress}
                          shouldFocus={focusStepId === step.id}
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
          <Button
              onClick={addStep}
              size={size === "sm" ? "sm" : "default"}
              className="w-full"
              variant="outline"
              disabled={disabled}
            >
              <Plus className={cn("mr-1.5", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
              Add step
            </Button>
        </motion.div>
      </div>
    );
  }
);

FunnelForm.displayName = "FunnelForm";
