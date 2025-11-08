"use client";

import React, { useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { cn } from "@/utils/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FunnelStep } from "./types";

interface SortableStepProps {
  step: FunnelStep;
  onDelete: (stepId: string) => void;
  onUpdate: (stepId: string, title: string) => void;
  disabled?: boolean;
  isDragging?: boolean;
  size?: "sm" | "md";
}

export const SortableStep = ({
  step,
  onDelete,
  onUpdate,
  disabled = false,
  isDragging = false,
  size = "md",
}: SortableStepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(step.title);
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: step.id,
    disabled: disabled,
  });

  const handleSave = useCallback(() => {
    if (title.trim()) {
      onUpdate(step.id, title.trim());
      setIsEditing(false);
      toast.success("Step updated");
    } else {
      setTitle(step.title);
      setIsEditing(false);
      toast.error("Step title cannot be empty");
    }
  }, [title, step.title, step.id, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setTitle(step.title);
        setIsEditing(false);
      }
    },
    [handleSave, step.title],
  );

  const handleDelete = useCallback(() => {
    onDelete(step.id);
    toast.success("Step removed");
  }, [step.id, onDelete]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSmall = size === "sm";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className={cn("group relative", isDragging || isSortableDragging)}
    >
      <Card
        {...(!isEditing ? { ...attributes, ...listeners } : {})}
        className={cn(
          "relative overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing py-0",
          "hover:shadow-md hover:border-primary/20",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
          isEditing && "ring-2 ring-primary/20 border-primary",
          isHovered && "bg-gradient-to-r from-primary/5 to-transparent",
          isEditing && "cursor-auto active:cursor-auto",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div
            className={cn("flex items-center gap-3", isSmall ? "p-2" : "p-3")}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-sm flex-shrink-0",
                isSmall ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-xs",
              )}
            >
              {step.order}
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium",
                    isSmall ? "h-6 px-1 text-xs" : "h-7 px-2 text-sm",
                  )}
                  autoFocus
                  placeholder="Enter step title..."
                />
              ) : (
                <button
                  onClick={() => !disabled && setIsEditing(true)}
                  className={cn(
                    "w-full text-left rounded-md transition-all duration-200",
                    "hover:bg-accent/50 hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    "font-medium text-foreground",
                    isSmall ? "px-1 py-0.5 text-xs" : "px-2 py-1 text-sm",
                    disabled && "cursor-default hover:bg-transparent",
                  )}
                >
                  {step.title}
                </button>
              )}
            </div>

            <AnimatePresence>
              {!disabled && (isHovered || isEditing) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    className={cn(
                      "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                      isSmall ? "h-6 w-6 p-0" : "h-7 w-7 p-0",
                    )}
                  >
                    <Trash2 className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
