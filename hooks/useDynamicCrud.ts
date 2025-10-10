'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api/auth";

export function useDynamicCrud(apiRoutes: any) {
  const queryClient = useQueryClient();

  // --- GET ALL ---
  const getAllQuery = useQuery({
    queryKey: ['tableData', apiRoutes.get_all],
    queryFn: async () => {
      const res = await api.get(apiRoutes.get_all);
      return res.data;
    },
    enabled: !!apiRoutes.get_all,
  });

  // --- CREATE ---
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post(apiRoutes.create, payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Item created successfully!");
      queryClient.invalidateQueries({ queryKey: ['tableData', apiRoutes.get_all] });
    },
    onError: (error: any) => {
      const backend = error?.response?.data;
      const message = backend?.message || "Failed to create item.";
      const details = backend?.errors
        ? Object.entries(backend.errors)
            .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
            .join("\n")
        : "";
      toast.error(`${message}${details ? "\n" + details : ""}`);
    },
  });

  // --- UPDATE ---
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const url = apiRoutes.update.replace("<int:pk>", String(id));
      const res = await api.put(url, payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Item updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['tableData', apiRoutes.get_all] });
    },
    onError: (error: any) => {
      const backend = error?.response?.data;
      const message = backend?.message || "Failed to update item.";
      const details = backend?.errors
        ? Object.entries(backend.errors)
            .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
            .join("\n")
        : "";
      toast.error(`${message}${details ? "\n" + details : ""}`);
    },
  });

  // --- DELETE ---
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = apiRoutes.delete.replace("<int:pk>", String(id));
      const res = await api.delete(url);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Item deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['tableData', apiRoutes.get_all] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete item. Please try again."
      );
    },
  });

  return { getAllQuery, createMutation, updateMutation, deleteMutation };
}
