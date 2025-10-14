'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DynamicTable } from './DynamicTable';
import { DynamicForm } from './DynamicForm';

export function DynamicCrudPage({ schema }: { schema: any }) {
  const queryClient = useQueryClient();

  const privileges = schema.role_privileges[0];
  const pageTitle = schema.submodules[0].name;
  const apiRoutes = schema.submodules[0].api_routes;
  const formSchema = schema.function_definitions;

  const tableColumns = formSchema.map((field: any) => ({
    accessorKey: field.input_name,
    header: field.label,
  }));

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsAlertOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const deleteUrl = apiRoutes.delete.replace('<int:pk>', String(id));
      const response = await api.delete(deleteUrl);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Item deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['tableData', apiRoutes.get_all] });
      setItemToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete item.');
      setItemToDelete(null);
    },
  });

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
    setIsAlertOpen(false);
  };

  const isEditMode = !!editingItem;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">{pageTitle} Management</h1>
        {privileges.can_add && (
          <Button onClick={handleAddNew}>Add New {pageTitle}</Button>
        )}
      </div>

      <DynamicTable
        columns={tableColumns}
        apiGetAllRoute={apiRoutes.get_all}
        privileges={privileges}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {isEditMode ? `Edit ${pageTitle}` : `Add New ${pageTitle}`}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? `Update the form below to edit the ${pageTitle}.`
                : `Fill out the form below to create a new ${pageTitle}.`}
            </DialogDescription>
          </DialogHeader>

          {/* IMPROVEMENT: Added overflow-y-auto for long forms */}
          <div className="overflow-y-auto pr-4">
            <DynamicForm
              key={editingItem ? editingItem.id : 'new'}
              schema={formSchema}
              apiCreateRoute={apiRoutes.create}
              apiUpdateRoute={apiRoutes.update}
              apiGetAllRoute={apiRoutes.get_all}
              initialData={editingItem}
              onClose={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}