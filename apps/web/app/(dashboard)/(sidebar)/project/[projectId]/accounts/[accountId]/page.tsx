import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAccountDropoffDetails } from "@/utils/queries/accounts/metrics";
import { getSingleAccountHealth } from "@/utils/queries/accounts/health";
import { parseValidatedDateRange } from "@/utils/helpers";
import { db } from "@repo/database";
import { RISK_TIER_CONFIG } from "@/typings";
import ClientLink from "@/components/client-link";
import CriticalAlert from "@/components/critical-alert";

import { cn } from "@/utils/helpers";

interface AccountDetailPageProps {
  params: Promise<{
    projectId: string;
    accountId: string;
  }>;
  searchParams?: Promise<{
    dateRange?: string;
  }>;
}

export default async function AccountDetailPage({
  params,
  searchParams,
}: AccountDetailPageProps) {
  const { projectId, accountId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const { from, to } = parseValidatedDateRange(resolvedSearchParams.dateRange);

  const [healthScoreResult, dropoffResult] = await Promise.all([
    getSingleAccountHealth({
      projectId,
      accountId,
      startDate: from,
      endDate: to,
    }),
    getAccountDropoffDetails({
      projectId,
      accountId,
      from,
      to,
    }),
  ]);

  const customerAccount = await db.customerAccount.findFirst({
    where: { accountId },
    include: {
      projects: {
        where: { projectId },
        select: { traits: true },
      },
    },
  });

  const healthScore = healthScoreResult.data;

  if (!healthScore) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/project/${projectId}/accounts`}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground">
            Error loading account data:{" "}
            {healthScoreResult.error || dropoffResult.error}
          </p>
        </div>
      </div>
    );
  }

  const dropoffDetails = dropoffResult.data || [];
  // const insights = await getAccountActionableInsights({
  //   healthScore,
  //   dropoffDetails,
  //   projectId,
  // });

  return (
    <div className="flex flex-col px-4 md:px-14 pb-12">
      <div className="pt-4">
        <Button variant="outline" size="icon" asChild>
          <ClientLink href={`/project/${projectId}/accounts`}>
            <ArrowLeftIcon className="w-4 h-4" />
          </ClientLink>
        </Button>
      </div>

      <div className="flex justify-between items-center gap-8 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Account Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Contextual insights and actionable recommendations
          </p>
        </div>
        <Badge
          className={cn(
            RISK_TIER_CONFIG[healthScore.risk_tier].badgeColor,
            "uppercase",
          )}
        >
          {RISK_TIER_CONFIG[healthScore.risk_tier].label}
        </Badge>
      </div>
      <CriticalAlert
        healthScore={healthScore.health_score}
        riskTier={healthScore.risk_tier}
        daysSinceLastActivity={healthScore.days_since_last_activity}
        completionRate={healthScore.cross_funnel_completion_rate}
        mrr={customerAccount?.mrr ?? undefined}
      />
    </div>
  );
}
