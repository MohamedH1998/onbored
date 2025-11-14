"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FunnelForm,
  FunnelFormRef,
  ActionButtons,
} from "@/components/funnel-builder";
import { Funnel, FunnelStep } from "@repo/database";
import { FunnelStep as FunnelBuilderStep } from "@/components/funnel-builder/types";

interface FunnelCreationFormProps {
  projectId: string;
  workspaceMemberId: string;
  funnel?: Funnel & { steps: FunnelStep[] };
}

const FunnelCreationForm = ({
  projectId,
  workspaceMemberId,
  funnel,
}: FunnelCreationFormProps) => {
  const funnelFormRef = useRef<FunnelFormRef>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (funnelFormRef.current) {
        setIsSaving(funnelFormRef.current.isSaving);
        setIsPublishing(funnelFormRef.current.isPublishing);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const initialSteps: FunnelBuilderStep[] = useMemo(() => {
    if (!funnel) return [];
    return funnel.steps
      .sort((a, b) => a.order - b.order)
      .map((step) => ({
        id: step.id,
        title: step.stepName,
        order: step.order,
        key: step.key,
      }));
  }, [funnel]);

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
      </motion.div>

      <FunnelForm
        ref={funnelFormRef}
        projectId={projectId}
        workspaceMemberId={workspaceMemberId}
        initialName={funnel?.name ?? ""}
        initialSteps={initialSteps}
        size="md"
        showNameInput={true}
        namePlaceholder="e.g., New User Onboarding, Product Demo Flow, Checkout Process"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-8 border-t border-border"
      >
        <ActionButtons
          onSaveDraft={() => funnelFormRef.current?.saveAsDraft()}
          onPublish={() => funnelFormRef.current?.publishFunnel()}
          isSaving={isSaving}
          isPublishing={isPublishing}
          size="md"
        />
      </motion.div>
    </div>
  );
};

export default FunnelCreationForm;
