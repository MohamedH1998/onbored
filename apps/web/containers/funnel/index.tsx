"use client";

import { StatBox } from "@/components/stat-box";
import { ActionableInsight, Stat, StepData } from "@/typings";
import { DataTable } from "@/components/data-table/data-table";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { ChartNoAxesColumnDecreasing } from "lucide-react";

import FunnelChart from "@/components/funnel-chart";
import ActionableInsights from "@/components/actionable-insights";

// Table configuration
const stepTableColumns = [
  {
    accessorKey: "name" as const,
    header: "Step Name",
    cell: (info: { getValue: () => string }) => info.getValue(),
  },
  {
    accessorKey: "views" as const,
    header: "Views",
    cell: (info: { getValue: () => number }) =>
      info.getValue().toLocaleString(),
  },
  {
    accessorKey: "skips" as const,
    header: "Skips",
    cell: (info: { getValue: () => number }) =>
      info.getValue().toLocaleString(),
  },
  {
    accessorKey: "completions" as const,
    header: "Completions",
    cell: (info: { getValue: () => number }) =>
      info.getValue().toLocaleString(),
  },
];

const StatsGrid = ({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) => (
  <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className || ""}`}>
    {stats.map((stat) => (
      <StatBox key={stat.title} {...stat} />
    ))}
  </div>
);

const OverviewCard = ({
  data,
  stepData,
}: {
  data: any;
  stepData: StepData[];
}) => {
  const funnelData = stepData.map((step) => ({
    id: step.name,
    value: step.views,
    label: step.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {funnelData.length > 0 ? (
          <FunnelChart data={funnelData} />
        ) : (
          <EmptyState
            className="bg-muted/50 border-border/80 w-full h-96 justify-center items-center"
            title="No funnel flow data available"
            description="Data will appear here once users start interacting with yourfunnel"
            icons={[ChartNoAxesColumnDecreasing]}
          />
        )}
      </CardContent>
    </Card>
  );
};

const StepTableCard = ({ stepData }: { stepData: StepData[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Step Table</CardTitle>
    </CardHeader>
    <CardContent>
      <DataTable
        columns={stepTableColumns as any}
        data={stepData}
        count={stepData.length}
        filterFields={[]}
        hideSearch
        hidePagination
      />
    </CardContent>
  </Card>
);

const FunnelContainer = ({
  stats,
  stepData,
  actionableInsightItems,
  sankeyData,
}: {
  stats: Stat[];
  stepData: StepData[];
  actionableInsightItems: ActionableInsight[];
  sankeyData: any;
}) => {
  const hasData =
    stats.length > 0 || stepData.length > 0 || sankeyData?.nodes?.length > 0;

  if (!hasData) {
    return (
      <div className="flex justify-center items-center h-96 text-muted-foreground">
        No data available yet
      </div>
    );
  }

  return (
    <div>
      <Separator className="bg-border data-[orientation=vertical]:h-screen data-[orientation=vertical]:w-px" />
      <div className="flex flex-col lg:flex-row gap-4 px-8 lg:px-0 h-full min-h-screen">
        <div className="flex-1 flex flex-col gap-6 py-8 lg:pl-8">
          <StatsGrid stats={stats} />
          <OverviewCard data={sankeyData} stepData={stepData} />
          <StepTableCard stepData={stepData} />
        </div>

        <Separator
          orientation="vertical"
          className="hidden lg:block bg-border h-screen w-px bg-red-500 border"
        />
        <div className="w-full lg:w-96 flex flex-col gap-4 py-8 lg:pr-8">
          <StatsGrid stats={stats} className="md:hidden" />
          <ActionableInsights actionableInsightItems={actionableInsightItems} />
        </div>
      </div>
    </div>
  );
};

export default FunnelContainer;
