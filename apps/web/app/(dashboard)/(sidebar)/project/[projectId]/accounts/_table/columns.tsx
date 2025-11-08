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
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { CustomerAccount } from "@repo/database";

const columnHelper = createColumnHelper<CustomerAccount[]>();

export const columns = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Name" />
    ),
    cell: ({ row }) => row.getValue("name"),
  }),

  columnHelper.accessor("plan", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    cell: ({ row }) => {
      const plan = row.getValue("plan") as string;
      return (
        <span className="text-sm text-muted-foreground">{plan || "-"}</span>
      );
    },
  }),
  columnHelper.accessor("mrr", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MRR" />
    ),
    cell: ({ row }) => {
      const mrr = row.getValue("mrr") as number;
      return (
        <span className="text-sm text-muted-foreground">{mrr || "-"}</span>
      );
    },
  }),
  columnHelper.accessor("lifecycle", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lifecycle" />
    ),
    cell: ({ row }) => {
      const lifecycle = row.getValue("lifecycle") as string;
      return (
        <span className="text-sm text-muted-foreground">
          {lifecycle || "-"}
        </span>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const account = row.original as unknown as CustomerAccount;
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
              <Link prefetch href={`#`} className="flex items-center">
                <Pencil className="mr-2 h-4 w-4Ì" />
                Edit Account
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
] as ColumnDef<CustomerAccount[]>[];
