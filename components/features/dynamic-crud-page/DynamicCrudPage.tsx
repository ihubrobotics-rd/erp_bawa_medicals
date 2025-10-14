'use client';
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RowSelectionState } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import api from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
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
import { DynamicTable } from "./DynamicTable";
import { DynamicForm } from "./DynamicForm"; // Assuming you have this component

export function DynamicCrudPage({ schema }: { schema: any }) {
  const queryClient = useQueryClient();
  // Defensive schema parsing
  const privileges = schema?.role_privileges?.[0] || { can_add: false, can_edit: false, can_delete: false };
  const primarySubmodule = schema?.submodules?.[0] || schema?.functionalities?.[0] || null;
  const pageTitle = primarySubmodule?.name || primarySubmodule?.submodule_name || "Items";
  const apiRoutes = primarySubmodule?.api_routes || { get_all: "", create: "", update: "", delete: "" };
  const formSchema = schema?.function_definitions || [];

  const tableColumns = formSchema.map((field: any) => ({
    accessorKey: field.input_name,
    header: field.label,
  }));

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);

  // Data fetching now lives in the parent component
  const { data: tableData = [], isLoading, isError } = useQuery({
    queryKey: ['tableData', apiRoutes.get_all],
    queryFn: async () => {
      if (!apiRoutes.get_all) return [];
      const response = await api.get(apiRoutes.get_all);
      return response.data.data.results || [];
    },
    enabled: !!apiRoutes.get_all, // Only run query if the route exists
  });

  // Handlers
  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemsToDelete([item]);
    setIsAlertOpen(true);
  };

  const handleBulkDeleteClick = () => {
    const selectedRowIndexes = Object.keys(rowSelection).map(Number);
    const selectedItems = tableData.filter((_, index) => selectedRowIndexes.includes(index));
    if (selectedItems.length > 0) {
      setItemsToDelete(selectedItems);
      setIsAlertOpen(true);
    }
  };

  // Mutation for single and bulk deletion
  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const deletePromises = ids.map(id => {
        const deleteUrl = apiRoutes.delete.replace("<int:pk>", String(id));
        return api.delete(deleteUrl);
      });
      return Promise.all(deletePromises);
    },
    onSuccess: (_, variables) => {
      toast.success(`${variables.length} item(s) deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ["tableData", apiRoutes.get_all] });
      setItemsToDelete([]);
      setRowSelection({});
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete item(s).");
      setItemsToDelete([]);
    },
  });

  const confirmDelete = () => {
    if (itemsToDelete.length > 0) {
      const idsToDelete = itemsToDelete.map((item) => item.id);
      deleteMutation.mutate(idsToDelete);
    }
    setIsAlertOpen(false);
  };

  const isEditMode = !!editingItem;
  const numSelected = Object.keys(rowSelection).length;

  const toolbarActions = (
    <div className="flex items-center gap-2">
      {numSelected > 0 && privileges?.can_delete && (
         <Button variant="destructive" size="sm" onClick={handleBulkDeleteClick}>
           <Trash2 className="mr-2 h-4 w-4" /> Delete ({numSelected})
         </Button>
      )}
      {privileges?.can_add && (
        <Button size="sm" onClick={handleAddNew}>Add New</Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">{pageTitle} Management</h1>
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
        searchPlaceholder={`Search ${pageTitle.toLowerCase()}...`}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="capitalize">{isEditMode ? `Edit ${pageTitle}` : `Add New ${pageTitle}`}</DialogTitle>
            <DialogDescription>
              {isEditMode ? `Update the details for this ${pageTitle}.` : `Fill out the form to create a new ${pageTitle}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-4">
            <DynamicForm
              key={editingItem ? editingItem.id : "new"}
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
              This action cannot be undone. This will permanently delete the <strong>{itemsToDelete.length} selected item(s)</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemsToDelete([])}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}