"use client";

import { type Table } from "@tanstack/react-table";

interface DataTableToolbarActionsProps {
  table: Table<any>;
  data: any[];
}

export function DataTableToolbarActions({
  table,
  data,
}: DataTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <div>
         // @TODO
        </div>
      ) : null} */}
    </div>
  );
}
