"use client";

import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/helpers";
import { StepsSection } from "./steps-section";
import { ActivationSection } from "./activation-section";
import { FunnelData } from "./types";
import { UniqueIdentifier } from "@dnd-kit/core";

interface FunnelBuilderProps {
  funnelData: FunnelData;
  onStepsChange: (steps: FunnelData["steps"]) => void;
  onActivationChange?: (activation: FunnelData["activation"]) => void;
  onNameChange: (name: string) => void;
  activeId: string | null;
  onActiveIdChange: (id: string | null) => void;
  size?: "sm" | "md";
  showNameInput?: boolean;
  nameDisabled?: boolean;
  namePlaceholder?: string;
  isOnboarding?: boolean;
}

export const FunnelBuilder = ({
  funnelData,
  onStepsChange,
  onActivationChange,
  onNameChange,
  activeId,
  onActiveIdChange,
  size = "md",
  showNameInput = true,
  nameDisabled = false,
  namePlaceholder = "Enter funnel name...",
  isOnboarding = false,
}: FunnelBuilderProps) => {
  const isSmall = size === "sm";

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
              isSmall ? "text-xs" : "text-sm",
            )}
          >
            Funnel name
          </label>
          <Input
            value={funnelData.name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={nameDisabled}
            placeholder={namePlaceholder}
            className={cn(isSmall ? "h-8 text-sm" : "h-9")}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StepsSection
          funnelData={funnelData}
          onStepsChange={onStepsChange}
          onActivationChange={onActivationChange}
          activeId={activeId}
          onActiveIdChange={
            onActiveIdChange as (id: UniqueIdentifier | null) => void
          }
          size={size}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {isOnboarding && onActivationChange && (
          <ActivationSection
            funnelData={funnelData}
            onActivationChange={onActivationChange}
            size={size}
          />
        )}
      </motion.div>
    </div>
  );
};
