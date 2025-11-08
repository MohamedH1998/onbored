import React from "react";
import AccountCard from "@/components/account-card";
import { getAccountHealthScores } from "@/utils/queries/accounts/health";
import { filterMergedAccounts, mergeAccountData } from "@/utils/data-merge";
import { getCustomerAccountsByAccountIds } from "@/utils/queries/customer-accounts";
import { EmptyState } from "@/components/empty-state";

const AccountsContainer = async ({
  projectId,
  filters,
  pageSize,
  from,
  to,
}: {
  projectId: string;
  filters: { id: string; value: string[] }[];
  pageSize: number | undefined;
  from: string;
  to: string;
}) => {
  const healthScoresResult = await getAccountHealthScores({
    projectId,
    startDate: from,
    endDate: to,
    page: 1,
    pageSize: pageSize || 50,
    sortBy: "health_score",
    sortOrder: "asc",
  });

  const healthScores = healthScoresResult.data || [];
  const accountIds = healthScores.map((score: any) => score.account_id);

  const customerAccounts = await getCustomerAccountsByAccountIds({
    accountIds,
    projectId,
  });

  let accounts = mergeAccountData(healthScores, customerAccounts);

  accounts = filterMergedAccounts(accounts, filters);

  return (
    <>
      {!accounts.length ? (
        <EmptyState
          className="border-none w-1/2 mx-auto"
          title="No accounts found"
          description="No accounts found for this project"
          redirectUrl={`/project/${projectId}/accounts/new`}
          redirectLabel="Create Account"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {accounts?.map((account, index) => (
            <AccountCard
              key={`${account.account_id}-${index}`}
              title={account.name || "N/A"}
              footerText={`Active: ${account.last_activity} ago`}
              badge={{
                label: account.plan || "Free",
                variant: "outline",
              }}
              riskTier={account.risk_tier}
              cta={{
                label: "View",
                href: `/project/${projectId}/accounts/${account.account_id}`,
                variant: "link",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AccountsContainer;
