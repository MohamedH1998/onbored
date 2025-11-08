"use client";

import React from "react";
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
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/helpers";
import { SortableStep } from "./sortable-step";
import { FunnelContainer } from "./funnel-container";
import {
  FunnelData,
  FunnelStep,
  generateUniqueKey,
  normalizeStepKey,
} from "./types";

interface StepsSectionProps {
  funnelData: FunnelData;
  onStepsChange: (steps: FunnelStep[]) => void;
  onActivationChange?: (activation: FunnelData["activation"]) => void;
  activeId: UniqueIdentifier | null;
  onActiveIdChange: (id: UniqueIdentifier | null) => void;
  size?: "sm" | "md";
  isOnboarding?: boolean;
}

export const StepsSection = ({
  funnelData,
  onStepsChange,
  onActivationChange,
  activeId,
  onActiveIdChange,
  size = "md",
  isOnboarding = false,
}: StepsSectionProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addStep = () => {
    const stepTitle = `Step ${funnelData.steps.length + 1}`;
    const normalizedKey = normalizeStepKey(stepTitle);
    const uniqueKey = generateUniqueKey(normalizedKey, funnelData.steps);

    const newStep: FunnelStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: stepTitle,
      order: funnelData.steps.length + 1,
      key: uniqueKey,
    };

    const nextSteps = [...funnelData.steps, newStep];
    onStepsChange(nextSteps);

    const nextActivation =
      funnelData.activation?.type === "step"
        ? { ...funnelData.activation, stepKey: funnelData.activation.stepKey }
        : funnelData.activation;

    if (isOnboarding && onActivationChange) {
      onActivationChange(
        nextActivation && nextActivation.type
          ? nextActivation
          : {
              type: "step",
              stepKey: newStep.key,
            },
      );
    }

    toast.success("Step added");
  };

  const updateStep = (stepId: string, title: string) => {
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

    const updatedSteps = funnelData.steps.map((step) =>
      step.id === stepId ? { ...step, title, key: uniqueKey } : step,
    );

    let updatedActivation = funnelData.activation;
    if (funnelData.activation?.type === "step") {
      const wasTarget = funnelData.steps.find((s) => s.id === stepId);
      if (wasTarget && funnelData.activation.stepKey === wasTarget.key) {
        updatedActivation = { ...funnelData.activation, stepKey: uniqueKey };
      }
    }

    onStepsChange(updatedSteps);
    if (isOnboarding && onActivationChange) {
      onActivationChange(updatedActivation);
    }
    toast.success("Step updated");
  };

  const deleteStep = (stepId: string) => {
    const deleted = funnelData.steps.find((s) => s.id === stepId);
    const updatedSteps = funnelData.steps
      .filter((step) => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index + 1 }));

    let updatedActivation = funnelData.activation;
    if (
      deleted &&
      funnelData.activation?.type === "step" &&
      funnelData.activation.stepKey === deleted.key
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

    onStepsChange(updatedSteps);
    if (isOnboarding && onActivationChange) {
      onActivationChange(updatedActivation);
    }
    toast.success("Step removed");
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    onActiveIdChange(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    onActiveIdChange(null);

    if (active.id !== over?.id) {
      const oldIndex = funnelData.steps.findIndex(
        (step) => step.id === active.id,
      );
      const newIndex = funnelData.steps.findIndex(
        (step) => step.id === over?.id,
      );

      const newSteps = arrayMove(funnelData.steps, oldIndex, newIndex);
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        order: index + 1,
      }));

      onStepsChange(updatedSteps);
      toast.success("Steps reordered");
    }
  };

  const activeStep = activeId
    ? funnelData.steps.find((step) => step.id === activeId)
    : null;

  const isSmall = size === "sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2
            className={cn(
              "font-semibold text-foreground",
              isSmall ? "text-sm" : "text-base",
            )}
          >
            Steps
          </h2>
          <p
            className={cn(
              "text-muted-foreground",
              isSmall ? "text-[10px]" : "text-xs",
            )}
          >
            {funnelData.steps.length} step
            {funnelData.steps.length !== 1 ? "s" : ""} • Drag to reorder
          </p>
        </div>
        <Button
          onClick={addStep}
          size="sm"
          className={cn(isSmall ? "h-7 px-2" : "h-8 px-3")}
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
        <SortableContext items={funnelData.steps.map((step) => step.id)}>
          <FunnelContainer
            hasItems={funnelData.steps.length > 0}
            isEmpty={funnelData.steps.length === 0}
            size={size}
          >
            <AnimatePresence mode="popLayout">
              {funnelData.steps.map((step) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  onDelete={deleteStep}
                  onUpdate={updateStep}
                  isDragging={activeId === step.id}
                  size={size}
                />
              ))}
            </AnimatePresence>
          </FunnelContainer>
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
    </div>
  );
};
