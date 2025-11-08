"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { parseAsFilter, parseAsSort } from "./parser";
import { cn } from "@/utils/helpers";
import { DataTableToolbarActions } from "./data-table-toolbar-actions";
import { DataTableFilterField } from "@/typings";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  count: number;
  filterFields: DataTableFilterField<TData>[];
  hideSearch?: boolean;
  hidePagination?: boolean;
  className?: string;
  bulkActionsComponent?: (props: {
    selectedRows: TData[];
    onClearSelection: () => void;
  }) => React.ReactNode;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  count,
  filterFields = [],
  hideSearch = false,
  hidePagination = false,
  className,
  bulkActionsComponent,
}: DataTableProps<TData, TValue>) => {
  const initialVisibility: VisibilityState = React.useMemo(() => {
    return columns.reduce((visibility, column) => {
      // @ts-ignore
      const columnId = column.id || column?.accessorKey;
      if (columnId) {
        // @ts-ignore
        visibility[columnId] = column.meta?.isVisible !== false; // Default to visible unless specified
      }
      return visibility;
    }, {} as VisibilityState);
  }, [columns]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility);

  const [sorting, setSorting] = useQueryState<SortingState>(
    "sort",
    parseAsSort.withDefault([]).withOptions({ shallow: false }),
  );

  const [globalFilter, setGlobalFilter] = useQueryState("search", {
    shallow: false,
    defaultValue: "",
    throttleMs: 1000, // TODO: Switch to debounceMs once it's available in nuqs
  });

  const [columnFilters, setColumnFilters] = useQueryState<ColumnFiltersState>(
    "filter",
    parseAsFilter.withDefault([]).withOptions({ shallow: false }),
  );

  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsInteger.withDefault(0),
      pageSize: parseAsInteger.withDefault(10),
    },
    { shallow: false },
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableSortingRemoval: false,
    rowCount: count,
    state: {
      sorting,
      pagination,
      globalFilter,
      columnVisibility,
      columnFilters,
      rowSelection,
    },
  });

  const selectedRows = React.useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [table, table.getState().rowSelection]);

  return (
    <div className={cn("space-y-4", className)}>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        hideSearch={hideSearch}
      >
        <DataTableToolbarActions table={table} data={data} />
      </DataTableToolbar>
      <div className="relative rounded-md border bg-white">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {!hidePagination && <DataTablePagination table={table} />}
      {bulkActionsComponent &&
        bulkActionsComponent({
          selectedRows,
          onClearSelection: () => table.resetRowSelection(),
        })}
    </div>
  );
};

export { DataTable };
