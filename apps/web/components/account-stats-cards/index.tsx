import React, { useMemo } from "react";
import { AccountTableRow } from "@/typings";
import InfoCard from "../info-card";
import { formatCurrency } from "@/utils/helpers/currency";

interface AccountStatsCardsProps {
  accounts: AccountTableRow[];
}

export function AccountStatsCards({ accounts }: AccountStatsCardsProps) {
  const accountStatsData = useMemo(() => {
    const totalAccounts = accounts.length;

    const counts = accounts.reduce(
      (acc, account) => {
        if (account.risk_tier === "healthy") {
          acc.healthy++;
          acc.healthyMrr += account.mrr || 0;
        } else if (account.risk_tier === "at_risk") {
          acc.atRisk++;
          acc.atRiskMrr += account.mrr || 0;
        } else if (account.risk_tier === "critical") {
          acc.critical++;
          acc.criticalMrr += account.mrr || 0;
        }
        return acc;
      },
      {
        healthy: 0,
        atRisk: 0,
        critical: 0,
        healthyMrr: 0,
        atRiskMrr: 0,
        criticalMrr: 0,
      },
    );

    const healthyPct =
      totalAccounts > 0
        ? Math.round((counts.healthy / totalAccounts) * 100)
        : 0;
    const atRiskPct =
      totalAccounts > 0 ? Math.round((counts.atRisk / totalAccounts) * 100) : 0;
    const criticalPct =
      totalAccounts > 0
        ? Math.round((counts.critical / totalAccounts) * 100)
        : 0;

    return [
      {
        title: "Total Accounts",
        value: totalAccounts,
        dateRange: `${totalAccounts} Active accounts tracked`,
      },
      {
        title: "Healthy Accounts",
        value: formatCurrency({ amount: counts.healthyMrr, currency: "USD" }),
        dateRange: `${healthyPct}% of total (>70% conversion)`,
      },
      {
        title: "At Risk Accounts",
        value: formatCurrency({ amount: counts.atRiskMrr, currency: "USD" }),
        dateRange: `${atRiskPct}% of total (40-70% conversion)`,
      },
      {
        title: "Critical Accounts",
        value: formatCurrency({ amount: counts.criticalMrr, currency: "USD" }),
        dateRange: `${criticalPct}% of total (<40% conversion)`,
      },
    ];
  }, [accounts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {accountStatsData.map((stat) => (
        <InfoCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          footerText={stat.dateRange}
        />
      ))}
    </div>
  );
}
