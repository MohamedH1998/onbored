"use client";

import { DataTableColumnHeader } from "@/components/data-table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Download, Eye } from "lucide-react";
import Link from "next/link";
import { formatDate } from "date-fns";
import { FunnelDropoff } from "@/typings";

const columnHelper = createColumnHelper<FunnelDropoff[]>();

export const columns = [
  columnHelper.accessor("step_id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Step" />
    ),
    cell: ({ row }) => row.getValue("step_id"),
  }),

  columnHelper.accessor("flow_started_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Started" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("flow_started_at") as Date;
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(createdAt, "MMM d, yyyy h:mm a")}
        </span>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const sessionReplay = row.original as unknown as FunnelDropoff;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link
                prefetch
                href={`insights/session/${sessionReplay.session_id}?step=${sessionReplay.step_id}`}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Replay
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`#`} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download Data
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled
              onClick={() => {
                navigator.clipboard.writeText(sessionReplay.session_id);
                // You might want to add a toast notification here
              }}
              className="flex items-center"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Session ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
] as ColumnDef<FunnelDropoff[]>[];
