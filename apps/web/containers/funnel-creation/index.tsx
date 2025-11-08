"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FunnelBuilder,
  useFunnelBuilder,
  ActionButtons,
  StatusBadges,
} from "@/components/funnel-builder";
import { useWorkspaceContext } from "@/components/context-provider";

export const FunnelCreationForm = ({
  isOnboarding,
}: {
  isOnboarding: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { project, workspace } = useWorkspaceContext();

  const {
    funnelData,
    activeId,
    setActiveId,
    isSaving,
    isPublishing,
    hasUnsavedChanges,
    updateSteps,
    updateActivation,
    updateName,
    saveAsDraft,
    publishFunnel,
  } = useFunnelBuilder({
    projectId: project?.id ?? "",
    workspaceMemberId: workspace?.id ?? "",
    initialData: {
      name: "Onboarding",
    },
    isOnboarding,
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl max-h-[90%] overflow-hidden p-0">
        <div className="flex h-full max-h-[90vh] flex-col">
          <AlertDialogHeader className="px-6 pt-6">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
            >
              <div className="space-y-1.5">
                <AlertDialogTitle className="flex items-center gap-2">
                  Create your first funnel
                  <StatusBadges
                    hasUnsavedChanges={hasUnsavedChanges}
                    size="sm"
                  />
                </AlertDialogTitle>
                <p className="text-sm text-muted-foreground">
                  Add a few steps and choose your activation moment.
                </p>
              </div>
              {!isOnboarding && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          </AlertDialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-2">
            <FunnelBuilder
              funnelData={funnelData}
              onStepsChange={updateSteps}
              onActivationChange={updateActivation}
              onNameChange={updateName}
              activeId={activeId as string}
              onActiveIdChange={setActiveId}
              size="sm"
              showNameInput={true}
              nameDisabled={true}
              namePlaceholder="Onboarding"
              isOnboarding={isOnboarding}
            />
          </div>

          <AlertDialogFooter className="sticky bottom-0 left-0 right-0 border-t bg-background px-6 py-4">
            <ActionButtons
              onSaveDraft={saveAsDraft}
              onPublish={publishFunnel}
              isSaving={isSaving}
              isPublishing={isPublishing}
              size="sm"
            />
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FunnelCreationForm;
