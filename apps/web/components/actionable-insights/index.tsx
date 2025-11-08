"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LocateFixed, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Gauge } from "lucide-react";
import { ActionableInsight } from "@/typings";

import { usePathname, useSearchParams } from "next/navigation";
import { serializeDateRange } from "@/utils/helpers";
import { getLast7Days } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const actionableInsightItemsConfig = {
  slowest: {
    icon: <Gauge size={33} className="text-yellow-500" />,
  },
  dropoff: {
    icon: <TriangleAlert size={33} />,
  },
};

const ActionableInsights = ({
  actionableInsightItems,
}: {
  actionableInsightItems: ActionableInsight[];
}) => {
  return (
    <Card className="gap-4 py-4 border-b ">
      <CardHeader className="flex items-center gap-2 px-3">
        <LocateFixed size={20} />
        <CardTitle>Actionable Insights</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-6 px-4">
        {actionableInsightItems.length === 0 ? (
          <EmptyState
            className="bg-muted/50 border-border/80"
            title="No insights available"
            description="Insights will appear here as we analyze your funnel data. Check back soon for optimization opportunities."
            icons={[Gauge]}
          />
        ) : (
          actionableInsightItems.map((item, idx) => {
            const config =
              actionableInsightItemsConfig[
                item.key as keyof typeof actionableInsightItemsConfig
              ];

            const currentPathname = usePathname();
            const searchParams = useSearchParams();
            const dateRange =
              searchParams.get("dateRange") ||
              serializeDateRange(getLast7Days());

            const newSearchParams = new URLSearchParams(item.replayQuery);
            newSearchParams.set("dateRange", dateRange);

            return (
              <div key={idx} className="flex flex-col gap-2 border-b pb-4">
                <div className="flex items-start flex-col gap-3">
                  <div className="flex flex-row gap-3">
                    <div
                      className={`pt-1 ${item.severity === "high" ? "text-red-500" : item.severity === "medium" ? "text-yellow-500" : "text-green-500"}`}
                    >
                      {config?.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        {item.title}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.subtitle}
                      </span>
                      {item.metrics && (
                        <span className="text-xs text-muted-foreground mt-1 font-mono bg-muted/50 px-2 py-1 rounded w-fit">
                          {item.metrics}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-2">{item.actionPrompt}</p>
                  {item.suggestedActions && (
                    <ul className="list-disc list-inside text-sm text-muted-foreground pl-1">
                      {item.suggestedActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Insight generated at{" "}
                    {new Date(item.generatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {item.replayQuery && (
                    <Button
                      asChild
                      variant="link"
                      className="px-0 text-sm"
                      size="sm"
                    >
                      <Link
                        prefetch
                        href={`${currentPathname}/insights?${newSearchParams}`}
                      >
                        View related sessions →
                      </Link>
                    </Button>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      Flag to Dev
                    </Button>
                    <Button variant="ghost" size="sm">
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ActionableInsights;
