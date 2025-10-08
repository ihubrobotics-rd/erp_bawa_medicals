'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import api from '@/lib/api/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

type DynamicTableProps = {
  columns: { accessorKey: string; header: string }[];
  apiGetAllRoute: string;
  privileges: {
    can_edit: boolean;
    can_delete: boolean;
  };
  onEdit: (row: any) => void; // 1. Add onEdit prop
  onDelete: (row: any) => void; // 2. Add onDelete prop
};

export function DynamicTable({
  columns,
  apiGetAllRoute,
  privileges,
  onEdit,
  onDelete,
}: DynamicTableProps) {
  const { data: tableData, isLoading, isError } = useQuery({
    queryKey: ['tableData', apiGetAllRoute],
    queryFn: async () => {
      const response = await api.get(apiGetAllRoute);
      return response.data.data.results || [];
    },
  });

  const tableColumns = useMemo(() => [
    ...columns,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {privileges.can_edit && (
              // 3. Connect onEdit handler
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
            )}
            {privileges.can_delete && (
              <DropdownMenuItem
                className="text-red-600"
                // 4. Connect onDelete handler
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [columns, privileges, onEdit, onDelete]); // 5. Add handlers to dependency array

  const table = useReactTable({
    data: tableData || [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading data...</div>;
  if (isError) return <div>Error loading data.</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}