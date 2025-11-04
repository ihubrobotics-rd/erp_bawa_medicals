"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RowSelectionState } from "@tanstack/react-table";
import { Trash2, Pencil } from "lucide-react"; // 👈 Import Pencil
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
import { Badge } from "@/components/ui/badge";
import { DynamicTable } from "./DynamicTable";
import { DynamicForm } from "./DynamicForm";

export function DynamicCrudPage({ schema }: { schema: any }) {
  const queryClient = useQueryClient();

  const privileges =
    schema?.role_privileges?.[0] || {
      can_add: false,
      can_edit: false,
      can_delete: false,
    };
  const submodule = schema?.submodules?.[0] || null;
  const apiRoutes = submodule?.api_routes || {};
  const formSchema = schema?.function_definitions || [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);

  // 🧠 Fetch table data
  const {
    data: tableData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tableData", apiRoutes.get_all],
    queryFn: async () => {
      const res = await api.get(apiRoutes.get_all);
      return res.data.data.results || [];
    },
    enabled: !!apiRoutes.get_all,
  });

  // ⚙️ Build columns dynamically based on API data and schema
  const tableColumns = useMemo(() => {
    if (!tableData.length && !formSchema.length) return [];

    const firstRow = tableData[0] || {};
    const schemaMap = Object.fromEntries(
      formSchema.map((f: any) => [f.input_name, f.label])
    );

const generatedCols = Object.keys(firstRow)
      .filter((key) => key !== "id")
      .map((key) => {
        const label =
          schemaMap[key] ||
          schemaMap[key.replace("", "")] ||
          key.replace("", " ");

        return {
          accessorKey: key,
          header: label,
    cell: ({ row }: any) => {
  const value = row.getValue(key);

  // Handle boolean fields
  if (typeof value === "boolean") {
    return (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    );
  }
  if (value === null || value === undefined || value === "") {
    return <Badge variant="outline">N/A</Badge>;
  }
  if (
    key.toLowerCase().includes("date") ||
    key.toLowerCase().includes("created_at") ||
    key.toLowerCase().includes("updated_at")
  ) {
    try {
      const formatted = new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
  }, []);

  const handleEdit = useCallback((item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
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

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      const deletePromises = ids.map((id) => {
        const deleteUrl = apiRoutes.delete.replace("<int:pk>", String(id));
        return api.delete(deleteUrl);
      });
      return Promise.all(deletePromises);
    },
    onSuccess: (_, vars) => {
      toast.success(`${vars.length} item(s) deleted successfully`);
      queryClient.invalidateQueries({
        queryKey: ["tableData", apiRoutes.get_all],
      });
      setItemsToDelete([]);
      setRowSelection({});
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete items.");
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

  // 👈 Get the single selected item (if only one is selected)
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

      {/* EXISTING DELETE BUTTON (shows when 1 or more items are selected) */}
      {numSelected > 0 && privileges.can_delete && (
        <Button variant="destructive" size="sm" onClick={handleBulkDeleteClick}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete ({numSelected})
        </Button>
      )}

      {/* EXISTING ADD NEW BUTTON */}
      {privileges.can_add && (
        <Button size="sm" onClick={handleAddNew}>
          Add New
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {submodule?.name || "Data"} Management
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
        searchPlaceholder={`Search ${
          submodule?.name?.toLowerCase() || "items"
        }...`}
      />

      {/* FORM DIALOG (unchanged) */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {editingItem
                ? `Edit ${submodule?.name}`
                : `Add New ${submodule?.name}`}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? `Update the details for this ${submodule?.name}.`
                : `Fill out the form to create a new ${submodule?.name}.`}
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

      {/* DELETE CONFIRMATION (unchanged) */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
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
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}