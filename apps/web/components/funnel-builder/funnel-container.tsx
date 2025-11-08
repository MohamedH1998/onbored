import React from "react";
import { cn } from "@/utils/helpers";
import { EmptyState } from "@/components/empty-state";
import { BellPlus, ShoppingBasket, Send } from "lucide-react";

interface FunnelContainerProps {
  children: React.ReactNode;
  hasItems: boolean;
  isEmpty: boolean;
  size?: "sm" | "md";
}

export const FunnelContainer = ({
  children,
  hasItems,
  isEmpty,
  size = "md",
}: FunnelContainerProps) => {
  const isSmall = size === "sm";

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative overflow-hidden border-2 border-dashed transition-all duration-300",
          isSmall ? "rounded-lg" : "rounded-xl",
          hasItems
            ? "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
            : "border-muted-foreground/20 bg-muted/30",
          isEmpty && "min-h-[200px] flex items-center justify-center",
        )}
      >
        {isEmpty ? (
          <EmptyState
            title="Create Your First Step"
            description="Start building your funnel by adding steps that guide users through your process"
            icons={[BellPlus, ShoppingBasket, Send]}
            className="text-center py-12 px-6 bg-zinc-50"
          />
        ) : (
          <div className={cn("space-y-2", isSmall ? "p-2" : "p-3")}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
