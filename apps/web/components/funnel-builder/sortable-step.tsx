"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { cn } from "@/utils/helpers";
import { motion } from "framer-motion";
import { FunnelStep } from "./types";

interface SortableStepProps {
  step: FunnelStep;
  onDelete: (stepId: string) => void;
  onUpdate: (stepId: string, title: string) => void;
  onEnterPress?: (stepId: string) => void;
  shouldFocus?: boolean;
  disabled?: boolean;
  isDragging?: boolean;
  size?: "sm" | "md";
}

export const SortableStep = ({
  step,
  onDelete,
  onUpdate,
  onEnterPress,
  shouldFocus = false,
  disabled = false,
  isDragging = false,
  size = "md",
}: SortableStepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(step.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: step.id,
    disabled: disabled,
  });

  const handleSave = useCallback(() => {
    if (title.trim()) {
      onUpdate(step.id, title.trim());
      setIsEditing(false);
    } else {
      setTitle(step.title);
      setIsEditing(false);
    }
  }, [title, step.title, step.id, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
        if (onEnterPress) {
          onEnterPress(step.id);
        }
      } else if (e.key === "Escape") {
        setTitle(step.title);
        setIsEditing(false);
      }
    },
    [handleSave, step.title, onEnterPress, step.id]
  );

  useEffect(() => {
    if (shouldFocus && !isEditing) {
      setIsEditing(true);
    }
  }, [shouldFocus, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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
    >
      <Card
        {...(!isEditing ? { ...attributes, ...listeners } : {})}
        className={cn(
          "cursor-grab active:cursor-grabbing py-0",
          isEditing && "cursor-auto active:cursor-auto"
        )}
      >
        <CardContent className="p-0">
          <div className={cn("flex items-center gap-3", isSmall ? "p-2" : "p-3")}>
            <div
              className={cn(
                "flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold flex-shrink-0",
                isSmall ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-xs"
              )}
            >
              {step.order}
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  ref={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium",
                    isSmall ? "h-6 px-1 text-xs" : "h-7 px-2 text-sm"
                  )}
                  placeholder="Enter step title..."
                />
              ) : (
                <button
                  onClick={() => !disabled && setIsEditing(true)}
                  className={cn(
                    "w-full text-left font-medium",
                    isSmall ? "px-1 py-0.5 text-xs" : "px-2 py-1 text-sm",
                    disabled && "cursor-default"
                  )}
                >
                  {step.title}
                </button>
              )}
            </div>

            {!disabled && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(step.id)}
                className={cn(
                  "text-muted-foreground hover:text-destructive",
                  isSmall ? "h-6 w-6 p-0" : "h-7 w-7 p-0"
                )}
              >
                <Trash2 className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
