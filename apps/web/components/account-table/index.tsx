//@TODO - Improve styling
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import {
  DataTableFilterField,
  AccountTableRow,
  TrendDirection,
  AccountRiskTier,
  RISK_TIER_CONFIG,
} from "@/typings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/sparkline";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/helpers";
import { AccountBulkActions } from "@/components/account-bulk-actions";
import { DataTableColumnHeader } from "../data-table";

interface AccountTableProps {
  data: AccountTableRow[];
  count: number;
  projectId: string;
}

// Helper function to format time duration
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

// Helper function to format currency (placeholder for MRR)
function formatMRR(mrr?: number): string {
  if (!mrr) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(mrr);
}

export function AccountTable({ data, count, projectId }: AccountTableProps) {
  const columns: ColumnDef<AccountTableRow>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Name" />
      ),
      cell: ({ row }) => row.getValue("name") || "-",
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        const plan = row.getValue("plan") as string;
        return (
          <Badge variant="outline" className="text-xs">
            {plan || "Free"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "mrr",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="MRR" />
      ),
      cell: ({ row }) => {
        const mrr = row.getValue("mrr") as number;
        return <span className="font-mono text-sm">{formatMRR(mrr)}</span>;
      },
    },
    {
      accessorKey: "risk_tier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Risk Tier" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("risk_tier") as AccountRiskTier;

        const statusConfig = RISK_TIER_CONFIG[status];

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-mono uppercase",
                statusConfig.badgeColor,
              )}
            >
              {statusConfig.label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "avg_completion_seconds",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avg Time" />
      ),
      cell: ({ row }) => {
        const seconds = row.getValue("avg_completion_seconds") as number;
        return (
          <span className="font-mono text-sm">{formatDuration(seconds)}</span>
        );
      },
    },
    {
      accessorKey: "trend_data",
      header: "Engagement Trend (7d)",
      cell: ({ row }) => {
        const trendDirection = row.original.trend_direction;

        if (!trendDirection) {
          return <span className="text-xs text-muted-foreground">No data</span>;
        }

        return <Sparkline trendDirection={trendDirection as TrendDirection} />;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const accountId = row.original.account_id;

        return (
          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
            <Link href={`#`}>
              <ExternalLink className="h-3 w-3" />
              <span className="sr-only">View account details</span>
            </Link>
          </Button>
        );
      },
    },
  ];

  const filterFields: DataTableFilterField<AccountTableRow>[] = [
    {
      id: "plan",
      label: "Plan",
      options: [
        { label: "Free", value: "free" },
        { label: "Pro", value: "pro" },
        { label: "Enterprise", value: "enterprise" },
      ],
    },
    {
      id: "risk_tier",
      label: "Risk Tier",
      options: [
        { label: "Critical (<25%)", value: "critical" },
        { label: "At Risk (25-50%)", value: "at_risk" },
        { label: "Healthy (>70%)", value: "healthy" },
      ],
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      count={count}
      filterFields={filterFields}
      className="w-full"
      bulkActionsComponent={({ selectedRows, onClearSelection }) => (
        <AccountBulkActions
          selectedAccounts={selectedRows}
          onClearSelection={onClearSelection}
        />
      )}
    />
  );
}
