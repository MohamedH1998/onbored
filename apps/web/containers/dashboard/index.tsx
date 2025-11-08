import React from "react";
import { AccountTable } from "@/components/account-table";
import { AccountStatsCards } from "@/components/account-stats-cards";
import {
  formatDateRange,
  parseFilter,
  parseValidatedDateRange,
} from "@/utils/helpers";
import { AccountTableSchema } from "@/containers/dashboard/types";
import { getAccountHealthScores } from "@/utils/queries/accounts/health";
import { mergeAccountData, filterMergedAccounts } from "@/utils/data-merge";
import { getCustomerAccountsByAccountIds } from "@/utils/queries/customer-accounts";
import { projectHasFunnels } from "@/utils/queries/funnels";
import FunnelCreationForm from "../funnel-creation";

interface DashboardContainerProps {
  projectId: Promise<string>;
  searchParams: Partial<AccountTableSchema>;
}

export default async function DashboardContainer({
  projectId,
  searchParams,
}: DashboardContainerProps) {
  const { from, to } = parseValidatedDateRange(searchParams.dateRange);
  const id = await projectId;

  const filters = parseFilter(searchParams.filter);

  const [healthScoresResult, hasFunnels] = await Promise.all([
    getAccountHealthScores({
      projectId: id,
      startDate: from,
      endDate: to,
      page: 1,
      pageSize: searchParams.pageSize || 50,
      sortBy: "health_score",
      sortOrder: "asc",
    }),
    projectHasFunnels(id),
  ]);

  if (!healthScoresResult.success) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">Error loading account data</p>
      </div>
    );
  }

  const healthScores = healthScoresResult.data || [];
  const accountIds = healthScores.map((score: any) => score.account_id);

  const customerAccounts = await getCustomerAccountsByAccountIds({
    accountIds,
    projectId: id,
  });

  let accounts = mergeAccountData(healthScores, customerAccounts);

  accounts = filterMergedAccounts(accounts, filters);

  return (
    <div className="flex flex-col gap-8">
      <AccountStatsCards accounts={accounts} />
      <AccountTable data={accounts} count={accounts.length} projectId={id} />
      <FunnelCreationForm isOnboarding={hasFunnels} />
    </div>
  );
}
