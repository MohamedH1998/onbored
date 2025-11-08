"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Zap } from "lucide-react";
import { cn } from "@/utils/helpers";

interface StatusBadgesProps {
  hasUnsavedChanges: boolean;
  size?: "sm" | "md";
}

export const StatusBadges = ({
  hasUnsavedChanges,
  size = "md",
}: StatusBadgesProps) => {
  const isSmall = size === "sm";

  return (
    <div className="flex items-center gap-2">
      {hasUnsavedChanges && (
        <Badge
          variant="secondary"
          className={cn(isSmall ? "h-6 px-2" : "animate-pulse")}
        >
          <AlertCircle
            className={cn("mr-1", isSmall ? "w-3 h-3" : "w-3 h-3")}
          />
          {isSmall ? "Unsaved" : "Unsaved changes"}
        </Badge>
      )}
      <Badge
        variant="outline"
        className={cn(isSmall ? "h-6 px-2" : "px-3 py-1")}
      >
        <Zap className={cn("mr-1", isSmall ? "w-3 h-3" : "w-3 h-3")} />
        Draft
      </Badge>
    </div>
  );
};
