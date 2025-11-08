"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FunnelBuilder,
  useFunnelBuilder,
  ActionButtons,
  StatusBadges,
} from "@/components/funnel-builder";
import { Funnel, FunnelStep } from "@repo/database";
import {
  FunnelData,
  FunnelStep as FunnelBuilderStep,
} from "@/components/funnel-builder/types";

interface FunnelCreationFormProps {
  projectId: string;
  workspaceMemberId: string;
  funnel?: Funnel & { steps: FunnelStep[] };
}

const transformFunnelData = (
  funnel: Funnel & { steps: FunnelStep[] },
): Partial<FunnelData> => {
  const steps: FunnelBuilderStep[] = funnel.steps
    .sort((a, b) => a.order - b.order)
    .map((step) => ({
      id: step.id,
      title: step.stepName,
      order: step.order,
      key: step.key,
    }));

  return {
    name: funnel.name,
    steps,
    activation: undefined,
  };
};

const FunnelCreationForm = ({
  projectId,
  workspaceMemberId,
  funnel,
}: FunnelCreationFormProps) => {
  const initialData = useMemo(() => {
    return funnel ? transformFunnelData(funnel) : {};
  }, [funnel]);

  const {
    funnelData,
    activeId,
    setActiveId,
    isSaving,
    isPublishing,
    hasUnsavedChanges,
    updateSteps,
    updateName,
    saveAsDraft,
    publishFunnel,
  } = useFunnelBuilder({
    projectId,
    workspaceMemberId,
    initialData,
  });

  return (
    <div className="w-full space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {funnel ? "Edit Funnel" : "Create Funnel"}
          </h1>
          <p className="text-muted-foreground">
            {funnel
              ? "Update your funnel configuration and steps"
              : "Design a step-by-step flow to guide your users through your process"}
          </p>
        </div>
        <StatusBadges hasUnsavedChanges={hasUnsavedChanges} size="md" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <label className="text-sm font-medium text-foreground">
          Funnel Name
        </label>
        <input
          value={funnelData.name}
          onChange={(e) => updateName(e.target.value)}
          placeholder="e.g., New User Onboarding, Product Demo Flow, Checkout Process"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </motion.div>

      <FunnelBuilder
        funnelData={funnelData}
        onStepsChange={updateSteps}
        onNameChange={updateName}
        activeId={activeId as string}
        onActiveIdChange={setActiveId}
        size="md"
        showNameInput={false}
      />

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-8 border-t border-border"
      >
        <ActionButtons
          onSaveDraft={saveAsDraft}
          onPublish={publishFunnel}
          isSaving={isSaving}
          isPublishing={isPublishing}
          size="md"
        />
      </motion.div>
    </div>
  );
};

export default FunnelCreationForm;
