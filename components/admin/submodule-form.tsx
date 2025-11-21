"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmodules } from "@/hooks/useModules";
import type { Submodule } from "@/types/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const submoduleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  is_active: z.boolean(),
  module: z.number(),
});

type SubmoduleFormData = z.infer<typeof submoduleSchema>;

interface SubmoduleFormProps {
  submodule: Submodule | null;
  moduleId: number;
  onClose: () => void;
}

export function SubmoduleForm({ submodule, moduleId, onClose }: SubmoduleFormProps) {
  const isEditMode = !!submodule;
  const { createSubmoduleMutation, updateSubmoduleMutation } = useSubmodules(moduleId);
  const { toast } = useToast();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<SubmoduleFormData>({
    resolver: zodResolver(submoduleSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
      module: moduleId,
    },
  });

  useEffect(() => {
    if (submodule) {
      reset(submodule);
    } else {
      reset({ name: "", description: "", is_active: true, module: moduleId });
    }
  }, [submodule, moduleId, reset]);

  const onSubmit = async (data: SubmoduleFormData) => {
    try {
      if (isEditMode) {
        await updateSubmoduleMutation.mutateAsync({ id: submodule.id, payload: data });
        toast({ title: "Success", description: "Submodule updated successfully." });
      } else {
        await createSubmoduleMutation.mutateAsync(data);
        toast({ title: "Success", description: "Submodule created successfully." });
      }
      onClose();
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "An error occurred." });
    }
  };

  const isLoading = createSubmoduleMutation.isPending || updateSubmoduleMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Submodule" : "Create New Submodule"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Form fields are identical to ModuleForm, but submit logic is different */}
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