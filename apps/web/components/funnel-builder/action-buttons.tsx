"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/helpers";

interface ActionButtonsProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const ActionButtons = ({
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  size = "md",
  className = "",
}: ActionButtonsProps) => {
  const isSmall = size === "sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`flex flex-col sm:flex-row justify-end gap-2 ${className}`}
    >
      <Button
        variant="outline"
        onClick={onSaveDraft}
        disabled={isSaving || isPublishing}
        className={cn(isSmall ? "h-10 px-5" : "h-11 px-6")}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {isSmall ? "Save draft" : "Save Draft"}
          </>
        )}
      </Button>
      <Button
        onClick={onPublish}
        disabled={isSaving || isPublishing}
        className={cn(
          "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
          isSmall ? "h-10 px-5" : "h-11 px-6",
        )}
      >
        {isPublishing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <ArrowRight className="w-4 h-4 mr-2" />
            {isSmall ? "Publish" : "Publish Funnel"}
          </>
        )}
      </Button>
    </motion.div>
  );
};
