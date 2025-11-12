"use client";

import * as React from "react";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { LucideIcon, UserRound } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icons?: LucideIcon[];
  redirectUrl?: string;
  redirectLabel?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icons = [UserRound],
  redirectUrl,
  redirectLabel,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-background border-border hover:border-border/80 text-center flex flex-col",
        "border-2 border rounded-xl p-14 w-full",
        "group hover:bg-muted/50 transition duration-500 hover:duration-200",
        className,
      )}
    >
      <div className="flex justify-center isolate">
        {icons.length === 3 ? (
          <>
            <div className="bg-background size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-border group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
            <div className="bg-background size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[1], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
            <div className="bg-background size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-border group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[2], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
          </>
        ) : (
          <div className="bg-background size-12 grid place-items-center rounded-xl shadow-lg ring-1 ring-border group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
            {icons[0] &&
              React.createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
          </div>
        )}
      </div>
      <h2 className="text-foreground font-medium mt-6">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
        {description}
      </p>
      {redirectUrl && (
        <Button
          asChild
          variant="outline"
          className={cn("mt-4", "shadow-sm active:shadow-none")}
        >
          <Link href={redirectUrl}>{redirectLabel}</Link>
        </Button>
      )}
    </div>
  );
}
