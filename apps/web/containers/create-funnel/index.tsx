"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWorkspaceContext } from "@/components/context-provider";
import { Funnel, FunnelStep } from "@repo/database";
import {
  FunnelForm,
  ActionButtons,
  transformFunnelSteps,
  FunnelFormRef,
} from "@/components/funnel-builder";

interface FunnelCreationFormProps {
  // Dialog mode (onboarding)
  isOnboarding?: boolean;
  defaultOpen?: boolean;

  // Page mode
  projectId?: string;
  workspaceMemberId?: string;
  funnel?: Funnel & { steps: FunnelStep[] };
}

const FunnelCreationForm = ({
  isOnboarding,
  defaultOpen = false,
  projectId,
  workspaceMemberId,
  funnel,
}: FunnelCreationFormProps) => {
  const { project, workspace } = useWorkspaceContext();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const ref = useRef<FunnelFormRef>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Dialog mode (onboarding)
  if (isOnboarding !== undefined) {
    const dialogProjectId = project?.id ?? "";
    const dialogWorkspaceId = workspace?.id ?? "";

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[90%] overflow-hidden p-0">
          <div className="flex h-full max-h-[90vh] flex-col">
            <AlertDialogHeader className="px-6 pt-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <AlertDialogTitle>Create your first funnel</AlertDialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Add a few steps to your onboarding funnel.
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
              </div>
            </AlertDialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-2">
              <FunnelForm
                ref={ref}
                projectId={dialogProjectId}
                workspaceMemberId={dialogWorkspaceId}
                initialName="Onboarding"
                isOnboarding={isOnboarding}
                size="sm"
                nameDisabled={true}
                namePlaceholder="Onboarding"
                onSavingChange={setIsSaving}
                onPublishingChange={setIsPublishing}
              />
            </div>

            <div className="sticky bottom-0 border-t bg-background px-6 py-4">
              <ActionButtons
                onSaveDraft={() => ref.current?.saveAsDraft()}
                onPublish={() => ref.current?.publishFunnel()}
                isSaving={isSaving}
                isPublishing={isPublishing}
                size="sm"
              />
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!projectId || !workspaceMemberId) return null;

  const initialSteps = transformFunnelSteps(funnel);

  return (
    <div className="w-full space-y-8">
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

      <FunnelForm
        ref={ref}
        projectId={projectId}
        workspaceMemberId={workspaceMemberId}
        initialName={funnel?.name ?? ""}
        initialSteps={initialSteps}
        namePlaceholder="e.g., New User Onboarding, Product Demo Flow, Checkout Process"
        onSavingChange={setIsSaving}
        onPublishingChange={setIsPublishing}
      />

      <div className="pt-8 border-t border-border">
        <ActionButtons
          onSaveDraft={() => ref.current?.saveAsDraft()}
          onPublish={() => ref.current?.publishFunnel()}
          isSaving={isSaving}
          isPublishing={isPublishing}
          size="md"
        />
      </div>
    </div>
  );
};

export default FunnelCreationForm;
