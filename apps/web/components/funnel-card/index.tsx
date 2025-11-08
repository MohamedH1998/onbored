import React from "react";
import { badgeVariants } from "@/components/ui/badge";
import { FunnelStatus } from "@repo/database";
import InfoCard from "../info-card";
import { VariantProps } from "class-variance-authority";

interface Funnel {
  id: string;
  name: string;
  version: string | null;
  status: FunnelStatus;
  createdAt: Date;
  createdById: string;
  projectId: string;
}

interface FunnelCardProps {
  funnel: Funnel;
}

const getStatusBadge = (status: FunnelStatus): string => {
  switch (status.toLowerCase()) {
    case "published":
      return "active";
    case "draft":
      return "outline";
    default:
      return "outline";
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const FunnelCard: React.FC<FunnelCardProps> = ({ funnel }) => {
  const getViewLink = () => {
    if (funnel.status.toLowerCase() === "draft") {
      return `/project/${funnel.projectId}/funnel/new?funnelId=${funnel.id}`;
    }
    return `/project/${funnel.projectId}/funnel/${funnel.id}`;
  };

  return (
    <InfoCard
      badge={{
        label: funnel.status,
        variant: getStatusBadge(funnel.status) as VariantProps<
          typeof badgeVariants
        >["variant"],
      }}
      title={`version ${funnel.version || "1.0"}`}
      value={funnel.name}
      footerText={`Created ${formatDate(funnel.createdAt.toISOString())}`}
      cta={{
        label: "View",
        href: getViewLink(),
        variant: "outline",
      }}
    />
  );
};

export default FunnelCard;
