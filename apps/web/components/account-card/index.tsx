import { cn } from "@/utils/helpers";
import { buttonVariants, Button } from "@/components/ui/button";
import React from "react";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Badge, badgeVariants } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AccountRiskTier } from "@/typings";
import { ChevronRight } from "lucide-react";

interface AccountCardProps {
  title: string;
  imageUrl?: string;
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
  healthy: "bg-green-600",
  at_risk: "bg-yellow-600",
  critical: "bg-red-600",
  default: "bg-gray-600",
};

const AccountCard = ({
  title,
  imageUrl,
  badge,
  footerText,
  cta,
  riskTier = "default",
}: AccountCardProps) => {
  const styles = statusStyles[riskTier];

  return (
    <div className="w-full max-w-lg md:max-w-[300px] border rounded-lg p-1 flex flex-col gap-2 relative bg-gray-100 border-gray-300">
      <div className="rounded-t-sm p-3 bg-white flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{title.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-2">
            <span className="relative flex size-4">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  styles,
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-4 rounded-full size-4",
                  styles,
                )}
              />
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-gray-600">{title}</p>
          <Badge variant={badge?.variant}>{badge?.label}</Badge>
        </div>
      </div>
      <div className="p-2 pt-0 px-3 flex items-center justify-between">
        <p className="text-xs font-mono uppercase">{footerText}</p>
        {cta && (
          <Button asChild size="sm" variant="outline">
            <Link prefetch href={cta.href}>
              {cta.label}
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccountCard;
