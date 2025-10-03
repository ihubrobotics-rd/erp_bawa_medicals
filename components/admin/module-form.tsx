"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useModules } from "@/hooks/useModules";
import type { Module } from "@/types/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const moduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  is_active: z.boolean().default(true),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface ModuleFormProps {
  module: Module | null;
  onClose: () => void;
}

export function ModuleForm({ module, onClose }: ModuleFormProps) {
  const isEditMode = !!module;
  const { createModuleMutation, updateModuleMutation } = useModules();
  const { toast } = useToast();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { is_active: true },
  });

  useEffect(() => {
    if (module) {
      reset(module);
    } else {
      reset({ name: "", description: "", is_active: true });
    }
  }, [module, reset]);

  const onSubmit = async (data: ModuleFormData) => {
    try {
      if (isEditMode) {
        await updateModuleMutation.mutateAsync({ id: module.id, payload: data });
        toast({ title: "Success", description: "Module updated successfully." });
      } else {
        await createModuleMutation.mutateAsync(data);
        toast({ title: "Success", description: "Module created successfully." });
      }
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An error occurred." });
    }
  };

  const isLoading = createModuleMutation.isPending || updateModuleMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Module" : "Create New Module"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
             <Controller name="is_active" control={control} render={({ field }) => <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />} />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}