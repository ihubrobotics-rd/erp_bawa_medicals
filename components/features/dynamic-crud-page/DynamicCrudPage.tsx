// @/components/features/dynamic-crud-page/DynamicCrudPage.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RowSelectionState } from '@tanstack/react-table';
import { Trash2, Pencil, ArrowLeft, X } from 'lucide-react'; // ADDED: X icon
import { useRouter } from 'next/navigation';
import api from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { DynamicTable } from './DynamicTable';
import { DynamicForm } from './DynamicForm';
import { useGlobalBack } from "@/hooks/useGlobalBack";

export function DynamicCrudPage({ schema }: { schema: any }) {
  const queryClient = useQueryClient();
  const { handleBack } = useGlobalBack();

  const privileges =
    schema?.role_privileges?.[0] || {
      can_add: false,
      can_edit: false,
      can_delete: false,
    };
  // CHANGED: Check for submodules OR functionalities
  const entityData =
    schema?.submodules?.[0] || schema?.functionalities?.[0] || null;
  // CHANGED: Use the new 'entityData' variable
  const apiRoutes = entityData?.api_routes || {};
  const formSchema = schema?.function_definitions || [];
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isBackAlertOpen, setIsBackAlertOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  
  // ADDED: State to track form dirty state
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

  //  Fetch table data
  const {
    data: tableData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tableData', apiRoutes.get_all],
    queryFn: async () => {
      const res = await api.get(apiRoutes.get_all);
      return res.data.data.results || [];
    },
    enabled: !!apiRoutes.get_all,
  });

  //  Build columns dynamically based on API data and schema
  const tableColumns = useMemo(() => {
    if (!tableData.length && !formSchema.length) return [];

    const firstRow = tableData[0] || {};
    const schemaMap = Object.fromEntries(
      formSchema.map((f: any) => [f.input_name, f.label])
    );

    const generatedCols = Object.keys(firstRow)
      .filter((key) => key !== 'id')
      .map((key) => {
        const label =
          schemaMap[key] ||
          schemaMap[key.replace('', '')] ||
          key.replace('', ' ');

        return {
          accessorKey: key,
          header: label,
          cell: ({ row }: any) => {
            const value = row.getValue(key);

            // Handle boolean fields
            if (typeof value === 'boolean') {
              return (
                <Badge variant={value ? 'default' : 'secondary'}>
                  {value ? 'Yes' : 'No'}
                </Badge>
              );
            }
            if (value === null || value === undefined || value === '') {
              return <Badge variant="outline">N/A</Badge>;
            }
            if (
              key.toLowerCase().includes('date') ||
              key.toLowerCase().includes('created_at') ||
              key.toLowerCase().includes('updated_at')
            ) {
              try {
                const formatted = new Date(value).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
                return <div>{formatted}</div>;
              } catch {
                return <div>{String(value)}</div>;
              }
            }
            return <div>{String(value)}</div>;
          },
        };
      });

    return generatedCols;
  }, [tableData, formSchema]);

  //  Handlers (wrapped in useCallback)
  const handleAddNew = useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
    setIsFormDirty(false); // RESET dirty state when opening form
  }, []);

  const handleEdit = useCallback((item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
    setIsFormDirty(false); // RESET dirty state when opening form
  }, []);

  const handleDeleteClick = useCallback((item: any) => {
    setItemsToDelete([item]);
    setIsAlertOpen(true);
  }, []);

  const handleBulkDeleteClick = useCallback(() => {
    const selectedIndexes = Object.keys(rowSelection).map(Number);
    const selectedItems = tableData.filter((_, idx) =>
      selectedIndexes.includes(idx)
    );
    if (selectedItems.length) {
      setItemsToDelete(selectedItems);
      setIsAlertOpen(true);
    }
  }, [rowSelection, tableData]);

  // ADDED: Handle form dirty state change
  const handleFormDirtyChange = useCallback((dirty: boolean) => {
    setIsFormDirty(dirty);
  }, []);

  // ADDED: Handle dialog close with dirty check
  const handleDialogClose = useCallback(() => {
    if (isFormDirty) {
      setIsCancelAlertOpen(true);
    } else {
      setIsFormOpen(false);
      setEditingItem(null);
      setIsFormDirty(false);
    }
  }, [isFormDirty]);

  // ADDED: Confirm close dialog
  const confirmCloseDialog = useCallback(() => {
    setIsCancelAlertOpen(false);
    setIsFormOpen(false);
    setEditingItem(null);
    setIsFormDirty(false);
  }, []);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      //  CHANGED: Check if apiRoutes.delete exists
      if (!apiRoutes.delete) {
        throw new Error('Delete API route is not defined.');
      }
      const deletePromises = ids.map((id) => {
        const deleteUrl = apiRoutes.delete.replace('<int:pk>', String(id));
        return api.delete(deleteUrl);
      });
      return Promise.all(deletePromises);
    },
    onSuccess: (_, vars) => {
      toast.success(`${vars.length} item(s) deleted successfully`);
      queryClient.invalidateQueries({
        queryKey: ['tableData', apiRoutes.get_all],
      });
      setItemsToDelete([]);
      setRowSelection({});
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete items.');
      setItemsToDelete([]);
    },
  });

  const confirmDelete = () => {
    if (itemsToDelete.length > 0) {
      const ids = itemsToDelete.map((item) => item.id);
      deleteMutation.mutate(ids);
    }
    setIsAlertOpen(false);
  };

  const numSelected = Object.keys(rowSelection).length;
  const selectedItem = useMemo(() => {
    const selectedIndexes = Object.keys(rowSelection).map(Number);
    if (selectedIndexes.length !== 1) {
      return null;
    }
    return tableData[selectedIndexes[0]];
  }, [rowSelection, tableData]);

  const handleToolbarEditClick = useCallback(() => {
    if (selectedItem) {
      handleEdit(selectedItem);
    }
  }, [selectedItem, handleEdit]);

  const toolbarActions = (
    <div className="flex items-center gap-2">
      {numSelected === 1 && privileges.can_edit && (
        <Button variant="outline" size="sm" onClick={handleToolbarEditClick}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      )}

      {numSelected > 0 && privileges.can_delete && (
        <Button variant="destructive" size="sm" onClick={handleBulkDeleteClick}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete ({numSelected})
        </Button>
      )}

      {privileges.can_add && (
        <Button size="sm" onClick={handleAddNew}>
          Add New
        </Button>
      )}
    </div>
  );
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="relative mb-6">
        {/* Back button positioned above heading with space */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="absolute -top-10 left-0 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>

        {/* Heading with extra top margin to create visual space */}
        <h1 className="mt-4 text-3xl font-bold capitalize">
          {entityData?.name || 'Data'} Management
        </h1>
      </div>
      <DynamicTable
        columns={tableColumns}
        data={tableData}
        isLoading={isLoading}
        isError={isError}
        privileges={privileges}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        toolbarActions={toolbarActions}
        searchPlaceholder={`Search ${entityData?.name?.toLowerCase() || 'items'}...`}
      />
      {/* FORM DIALOG */}
      <Dialog open={isFormOpen} onOpenChange={handleDialogClose} >
        <DialogContent 
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          {/* ADDED: Close (X) button in header */}
          <div className="relative">
            <DialogHeader>
              <DialogTitle className="capitalize">
                {editingItem
                  ? `Edit ${entityData?.name}`
                  : `Add New ${entityData?.name}`}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? `Update the details for this ${entityData?.name}.`
                  : `Fill out the form to create a new ${entityData?.name}.`}
              </DialogDescription>
            </DialogHeader>
            
            {/* Close (X) button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-6 w-6 p-0"
              onClick={handleDialogClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-y-auto pr-4">
            <DynamicForm
              key={editingItem ? editingItem.id : 'new'}
              schema={formSchema}
              apiCreateRoute={apiRoutes.create}
              apiUpdateRoute={apiRoutes.update}
              apiGetAllRoute={apiRoutes.get_all}
              initialData={editingItem}
              onClose={() => {
                setIsFormOpen(false);
                setEditingItem(null);
                setIsFormDirty(false);
              }}
              onDirtyChange={handleFormDirtyChange} // ADDED: Pass dirty state handler
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* DELETE CONFIRMATION */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <strong>{itemsToDelete.length} selected item(s)</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemsToDelete([])}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ADDED: UNSAVED CHANGES ALERT */}
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCloseDialog}
              className="bg-red-600 hover:bg-red-700"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}