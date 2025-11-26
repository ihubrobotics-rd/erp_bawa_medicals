"use client";

import { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useModules } from "@/hooks/useModules";
import type { Module } from "@/types/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// -----------------------------
// ZOD SCHEMA
// -----------------------------
const moduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  is_active: z.boolean(),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  module: Module | null;
  onClose: () => void;
}

export function ModuleForm({ module, onClose }: ModuleFormProps) {
  const isEditMode = !!module;
  const { createModuleMutation, updateModuleMutation } = useModules();

  // -----------------------------
  // REACT HOOK FORM SETUP
  // -----------------------------
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  // -----------------------------
  // SET FORM VALUES WHEN EDITING
  // -----------------------------
  useEffect(() => {
    if (module) {
      reset({
        name: module.name,
        description: module.description,
        is_active: module.is_active,
      });
    } else {
      reset({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [module, reset]);

  // -----------------------------
  // TANSTACK QUERY ERROR HANDLERS
  // -----------------------------
  useEffect(() => {
    if (createModuleMutation.isError) {
      const error: any = createModuleMutation.error;
      
      // Check if error has validation errors from API
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        
        // Display each field error
        Object.entries(errors).forEach(([field, messages]) => {
          const errorMessages = Array.isArray(messages) ? messages : [messages];
          errorMessages.forEach((msg: string) => {
            toast.error(`${field}: ${msg}`);
          });
        });
      } else {
        // Fallback to general error message
        toast.error("Failed to create module", {
          description:
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred while creating the module.",
        });
      }
    }
  }, [createModuleMutation.isError, createModuleMutation.error]);

  useEffect(() => {
    if (updateModuleMutation.isError) {
      const error: any = updateModuleMutation.error;
      
      // Check if error has validation errors from API
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        
        // Display each field error
        Object.entries(errors).forEach(([field, messages]) => {
          const errorMessages = Array.isArray(messages) ? messages : [messages];
          errorMessages.forEach((msg: string) => {
            toast.error(`${field}: ${msg}`);
          });
        });
      } else {
        // Fallback to general error message
        toast.error("Failed to update module", {
          description:
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred while updating the module.",
        });
      }
    }
  }, [updateModuleMutation.isError, updateModuleMutation.error]);

  // -----------------------------
  // TANSTACK QUERY SUCCESS HANDLERS
  // -----------------------------
  useEffect(() => {
    if (createModuleMutation.isSuccess) {
      toast.success("Module created successfully");
      onClose();
    }
  }, [createModuleMutation.isSuccess, onClose]);

  useEffect(() => {
    if (updateModuleMutation.isSuccess) {
      toast.success("Module updated successfully");
      onClose();
    }
  }, [updateModuleMutation.isSuccess, onClose]);

  // -----------------------------
  // FORM SUBMIT HANDLER
  // -----------------------------
  const onSubmit: SubmitHandler<ModuleFormData> = (data) => {
    if (isEditMode && module) {
      updateModuleMutation.mutate({
        id: module.id,
        payload: data,
      });
    } else {
      createModuleMutation.mutate(data);
    }
  };

  const isLoading =
    createModuleMutation.isPending || updateModuleMutation.isPending;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Module" : "Create New Module"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}