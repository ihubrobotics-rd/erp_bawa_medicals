'use client';

import React, { useState } from 'react'; // Import useState
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api/auth';
import { Button } from '@/components/ui/button';

// 1. Import all the necessary AlertDialog components
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

  // --- Data Transformation ---
  const privileges = schema.role_privileges[0];
  const pageTitle = schema.submodules[0].name;
  const apiRoutes = schema.submodules[0].api_routes;
  const formSchema = schema.function_definitions;

  const tableColumns = formSchema.map((field: any) => ({
    accessorKey: field.input_name,
    header: field.label,
  }));

  // --- STATE MANAGEMENT ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // 2. Add state for the delete confirmation dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  // --- HANDLERS ---
  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // 3. Modify the handleDelete function to open the AlertDialog
  const handleDeleteClick = (item: any) => {
    setItemToDelete(item); // Store the item to be deleted
    setIsAlertOpen(true);   // Open the confirmation dialog
  };

  // --- MUTATIONS ---
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      const deleteUrl = apiRoutes.delete.replace('<int:pk>', id);
      return api.delete(deleteUrl);
    },
    onSuccess: () => {
      toast.success('Item deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['tableData', apiRoutes.get_all] });
      setItemToDelete(null); // Clean up
    },
    onError: (error) => {
      toast.error('Failed to delete item.');
      console.error(error);
      setItemToDelete(null); // Clean up
    },
  });

  // 4. This function will be called when the user confirms the deletion in the modal
  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
    setIsAlertOpen(false); // Close the dialog
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
        onDelete={handleDeleteClick} // 5. Pass the new handler to the table
      />
      
      {/* Edit/Add Form Dialog (No changes here) */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
          <div className="py-4">
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
      
      {/* 6. Add the AlertDialog component for delete confirmation */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
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