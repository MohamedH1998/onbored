import type { AccountHealthScore } from "@/typings";
import type { CustomerAccount } from "@repo/database";

export interface MergedAccountData {
  account_id: string;

  // From DB
  name?: string;
  plan?: string;
  mrr?: number;
  lifecycle?: string;

  // From Tinybird
  health_score: number;
  risk_tier: AccountHealthScore["risk_tier"];
  account_name?: string;
  trend_direction: AccountHealthScore["trend_direction"];
  cross_funnel_completion_rate: number;
  days_since_last_activity: number;
  last_activity_at: string;
  conversion_rate_pct: number;
  avg_completion_seconds: number;
  last_activity: string;
}

export function mergeAccountData(
  healthScores: AccountHealthScore[],
  customerAccounts: Pick<
    CustomerAccount,
    "accountId" | "name" | "plan" | "mrr" | "lifecycle"
  >[],
): MergedAccountData[] {
  const customerMap = new Map(customerAccounts.map((ca) => [ca.accountId, ca]));

  return healthScores.map((score) => {
    const customer = customerMap.get(score.account_id);

    return {
      account_id: score.account_id,
      name: customer?.name || score.account_name,
      plan: customer?.plan || undefined,
      mrr: customer?.mrr || undefined,
      lifecycle: customer?.lifecycle || undefined,
      health_score: score.health_score,
      risk_tier: score.risk_tier,
      trend_direction: score.trend_direction,
      cross_funnel_completion_rate: score.cross_funnel_completion_rate,
      days_since_last_activity: score.days_since_last_activity,
      last_activity_at: score.last_activity_at,
      conversion_rate_pct: score.cross_funnel_completion_rate,
      avg_completion_seconds: 0,
      last_activity: `${score.days_since_last_activity} days`,
    };
  });
}

export function filterMergedAccounts(
  accounts: MergedAccountData[],
  filters: Array<{ id: string; value: string[] }>,
): MergedAccountData[] {
  if (filters.length === 0) return accounts;

  return accounts.filter((account) => {
    return filters.every((filter) => {
      const { id, value } = filter;

      if (id === "risk_tier") {
        return value.includes(account.risk_tier);
      }
      if (id === "plan") {
        return value.some(
          (v) => account.plan?.toLowerCase() === v.toLowerCase(),
        );
      }
      if (id === "lifecycle") {
        return account.lifecycle ? value.includes(account.lifecycle) : false;
      }
      return true;
    });
  });
}
