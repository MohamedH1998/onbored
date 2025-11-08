import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Clock, TrendingDown } from "lucide-react";

interface CriticalAlertProps {
  healthScore: number;
  riskTier: "critical" | "at_risk" | "healthy";
  daysSinceLastActivity: number;
  completionRate: number;
  mrr?: number;
}

export default function CriticalAlert({
  healthScore,
  riskTier,
  daysSinceLastActivity,
  completionRate,
  mrr,
}: CriticalAlertProps) {
  if (riskTier !== "critical" && riskTier !== "at_risk") {
    return null;
  }

  const alerts = [];

  if (completionRate === 0) {
    alerts.push({
      icon: AlertTriangle,
      label: "Critical Risk",
      value: "Zero completed flows",
      color: "text-red-600",
    });
  }

  if (mrr && mrr > 0) {
    alerts.push({
      icon: DollarSign,
      label: "Revenue Impact",
      value: `$${mrr} MRR at risk`,
      color: "text-orange-600",
    });
  }

  const hoursSinceActivity = daysSinceLastActivity * 24;
  if (hoursSinceActivity > 48) {
    alerts.push({
      icon: Clock,
      label: "Time to Act",
      value: `Last seen ${hoursSinceActivity}h ago`,
      color: "text-orange-600",
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-3">
      <CardContent className="px-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-red-800 dark:text-red-100">
              Account Requires Immediate Attention
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alerts.map((alert, index) => {
                // const Icon = alert.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white dark:bg-gray-900 p-3 rounded-lg border"
                  >
                    {/* <Icon className={`h-4 w-4 ${alert.color}`} /> */}
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {alert.label}
                      </p>
                      <p className="text-sm font-semibold">{alert.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {healthScore < 20 && (
              <p className="text-sm text-red-800 dark:text-red-200">
                This account is in the bottom{" "}
                {Math.round((healthScore / 100) * 100)}% of all accounts.
                Immediate intervention recommended.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
