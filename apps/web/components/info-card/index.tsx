import { AccountRiskTier } from "@/typings";
import { cn } from "@/utils/helpers";
import { buttonVariants, Button } from "@/components/ui/button";
import React from "react";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Badge, badgeVariants } from "../ui/badge";

interface InfoCardProps {
  title: string;
  value: string | number;
  description?: string;
  footerText: string;
  badge?: {
    label: string;
    variant: VariantProps<typeof badgeVariants>["variant"];
  };
  riskTier?: AccountRiskTier | "default";
  cta?: {
    label: string;
    href: string;
    variant: VariantProps<typeof buttonVariants>["variant"];
  };
}

const statusStyles = {
  healthy: {
    container: "bg-green-100 border-green-300",
    text: "text-green-700",
  },
  at_risk: {
    container: "bg-yellow-100 border-yellow-300",
    text: "text-yellow-500",
  },
  critical: {
    container: "bg-red-100 border-red-300",
    text: "text-red-500",
  },
  default: {
    container: "bg-gray-100 border-gray-300",
    text: "text-gray-500",
  },
} as const;

const InfoCard = ({
  title,
  value,
  description,
  badge,
  footerText,
  cta,
  riskTier = "default",
}: InfoCardProps) => {
  const styles = statusStyles[riskTier];

  return (
    <div
      className={cn(
        "w-full max-w-lg md:max-w-[300px] rounded-lg p-1 flex flex-col gap-2",
        styles.container,
      )}
    >
      <div className="rounded-t-sm p-3 bg-white border flex flex-col gap-3">
        <span className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{title}</p>
          {badge && <Badge variant={badge?.variant}>{badge?.label}</Badge>}
        </span>
        <p className={cn("text-2xl font-bold", styles.text)}>{value}</p>
        {description && <p className="text-sm text-black/80">{description}</p>}
      </div>
      <div className="p-2 pt-0 px-3 flex items-center justify-between">
        <p className="text-xs font-mono uppercase">{footerText}</p>
        {cta && (
          <Button asChild size="sm" variant={cta.variant}>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
