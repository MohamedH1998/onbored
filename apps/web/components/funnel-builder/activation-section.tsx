"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/helpers";
import { AutoHeight } from "./auto-height";
import { FunnelData } from "./types";

interface ActivationSectionProps {
  funnelData: FunnelData;
  onActivationChange: (activation: FunnelData["activation"]) => void;
  size?: "sm" | "md";
}

export const ActivationSection = ({
  funnelData,
  onActivationChange,
  size = "md",
}: ActivationSectionProps) => {
  const isSmall = size === "sm";

  return (
    <div className="space-y-3">
      <div className="space-y-0.5">
        <h2
          className={cn(
            "font-semibold flex items-center gap-2",
            isSmall ? "text-sm" : "text-base",
          )}
        >
          Activation moment
        </h2>
        <p
          className={cn(
            "text-muted-foreground",
            isSmall ? "text-[10px]" : "text-xs",
          )}
        >
          The moment users first experience value. Used for retention and
          alerts.
        </p>
      </div>

      <div
        className={cn(
          "border space-y-3",
          isSmall ? "rounded-lg p-3" : "rounded-xl p-4",
        )}
      >
        <div className="flex flex-row gap-2">
          <Button
            type="button"
            variant={
              funnelData.activation?.type !== "custom" ? "default" : "outline"
            }
            className={cn(isSmall ? "h-7 px-2 text-xs" : "h-8 px-3")}
            onClick={() => {
              const lastKey =
                funnelData.steps[funnelData.steps.length - 1]?.key;
              onActivationChange({
                type: "step",
                stepKey:
                  funnelData.activation?.type === "step"
                    ? funnelData.activation.stepKey
                    : lastKey,
              });
            }}
          >
            Choose a step
          </Button>
          <Button
            type="button"
            variant={
              funnelData.activation?.type === "custom" ? "default" : "outline"
            }
            className={cn(isSmall ? "h-7 px-2 text-xs" : "h-8 px-3")}
            onClick={() => {
              onActivationChange({
                type: "custom",
                customEventName:
                  funnelData.activation?.type === "custom"
                    ? funnelData.activation.customEventName
                    : "",
              });
            }}
          >
            Custom event
          </Button>
        </div>

        <AnimatePresence initial={false} mode="wait">
          <AutoHeight isVisible={funnelData.activation?.type !== "custom"}>
            <motion.div
              key="step-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-2"
            >
              {funnelData.steps.length === 0 ? (
                <p
                  className={cn(
                    "text-muted-foreground",
                    isSmall ? "text-xs" : "text-sm",
                  )}
                >
                  Add steps to choose your activation moment.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {funnelData.steps.map((s) => {
                    const selected =
                      funnelData.activation?.stepKey === s.key ||
                      (!funnelData.activation &&
                        s.order === funnelData.steps.length);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onActivationChange({
                            type: "step",
                            stepKey: s.key,
                          });
                        }}
                        className={cn(
                          "w-full border rounded-md text-left hover:bg-accent transition",
                          isSmall ? "px-2 py-1.5" : "px-3 py-2",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "font-medium",
                              isSmall ? "text-xs" : "text-sm",
                            )}
                          >
                            {s.title}
                          </span>
                          {selected && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                isSmall ? "text-[9px] h-4" : "text-[10px] h-5",
                              )}
                            >
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-muted-foreground mt-1",
                            isSmall ? "text-[10px]" : "text-xs",
                          )}
                        >
                          Step {s.order}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AutoHeight>

          <AutoHeight isVisible={funnelData.activation?.type === "custom"}>
            <motion.div
              key="custom-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-2"
            >
              <label
                className={cn(
                  "font-medium",
                  isSmall ? "text-[10px]" : "text-xs",
                )}
              >
                Custom activation event
              </label>
              <Input
                value={funnelData.activation?.customEventName ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  onActivationChange({
                    type: "custom",
                    customEventName: value,
                  });
                }}
                placeholder='e.g. "invited_team_member" or "export_completed"'
                className={cn(isSmall ? "h-8 text-xs" : "h-9")}
              />
              <p
                className={cn(
                  "text-muted-foreground",
                  isSmall ? "text-[9px]" : "text-[11px]",
                )}
              >
                Use the exact event name you track in your product.
              </p>
            </motion.div>
          </AutoHeight>
        </AnimatePresence>
      </div>
    </div>
  );
};
