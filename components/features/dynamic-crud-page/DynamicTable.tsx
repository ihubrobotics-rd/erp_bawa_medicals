"use client";

import React, { useMemo, Dispatch, SetStateAction } from "react";
import {
  Column,
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

type DataRow = Record<string, any>;
type DynamicTableProps = {
  data: DataRow[];
  columns: {
    accessorKey: string;
    header: string;
    cell?: ({ row }: any) => JSX.Element;
  }[];
  isLoading: boolean;
  isError: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  privileges: {
    can_edit: boolean;
    can_delete: boolean;
    can_add?: boolean;
  };
  onEdit: (row: DataRow) => void;
  onDelete: (row: DataRow) => void;
  searchPlaceholder?: string;
  toolbarActions?: React.ReactNode;
};

export function DynamicTable({
  data,
  columns: initialColumns,
  isLoading,
  isError,
  rowSelection,
  setRowSelection,
  privileges,
  onEdit,
  onDelete,
  searchPlaceholder = "Search...",
  toolbarActions,
}: DynamicTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [viewRow, setViewRow] = React.useState<DataRow | null>(null);


  //  Build columns dynamically
  const columns = useMemo<ColumnDef<DataRow>[]>(() => {
    if (!Array.isArray(initialColumns) || initialColumns.length === 0) {
      // Return base columns (select, actions) even if data-driven columns are empty
      // This is crucial for the empty table state
      const baseColumns: ColumnDef<DataRow>[] = [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
      ];

      //  Add Actions column if privileges allow
      if (privileges.can_edit || privileges.can_delete) {
        baseColumns.push({
          id: "actions",
          header: () => <div className="text-right">Actions</div>,
          cell: ({ row }) => (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {privileges.can_edit && (
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                  )}
                  {privileges.can_delete && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(row.original)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
        });
      }
      return baseColumns;
    }

    // --- This is the original logic for when data EXISTS ---
    const baseColumns: ColumnDef<DataRow>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...initialColumns.map((col) => ({
        accessorKey: col.accessorKey,
        header: ({ column }: { column: Column<DataRow, unknown> }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            {col.header}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell:
          col.cell ??
          (({ row }: any) => {
            const value = row.getValue(col.accessorKey);
            const nameField = `${col.accessorKey}_name`;
            if (row.original && row.original[nameField]) {
              return <div>{row.original[nameField]}</div>;
            }
            if (value === null || value === undefined || value === "") {
              return <div className="text-muted">-</div>;
            }
            return <div>{String(value)}</div>;
          }),
      })),
    ];

    //  Add Actions column if privileges allow
    if (privileges.can_edit || privileges.can_delete) {
      baseColumns.push({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {privileges.can_edit && (
                  <DropdownMenuItem onClick={() => onEdit(row.original)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                )}
                {privileges.can_delete && (
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => onDelete(row.original)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }
    return baseColumns;
  }, [initialColumns, privileges, onEdit, onDelete]);

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  //  Error handling
  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading data.</div>;
  }


  const hasRows = table.getRowModel().rows.length > 0;

  return (
    <div className="w-full space-y-4">
      {/*  Search bar + toolbar */}
      <div className="flex items-center justify-between">
        {initialColumns?.[0]?.accessorKey && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table
                .getColumn(initialColumns[0].accessorKey)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(initialColumns[0].accessorKey)
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {/* If no search bar, this div keeps the toolbarActions to the right */}
        {!initialColumns?.[0]?.accessorKey && <div className="max-w-sm" />}
        <div className="flex items-center gap-2">{toolbarActions}</div>
      </div>

      {/*  Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : hasRows ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length} 
                  className="h-24 text-center text-gray-500"
                >
                  No data available.{" "}
                  {privileges.can_add
                    ? "Click Add New to create an entry."
                    : ""}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/*  Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}