"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmodules, useFunctionalities } from "@/hooks/useModules";
import type { Functionality } from "@/types/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const functionalitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  is_active: z.boolean().default(true),
  submodule: z.number(),
});

type FunctionalityFormData = z.infer<typeof functionalitySchema>;
interface FunctionalityFormProps {
  functionality: Functionality | null;
  submoduleId: number;
  onClose: () => void;
}

export function FunctionalityForm({ functionality, submoduleId, onClose }: FunctionalityFormProps) {
  const isEditMode = !!functionality;
  const { createFunctionalityMutation } = useSubmodules(null); // Pass null as we only need the mutation
  const { updateFunctionalityMutation } = useFunctionalities(submoduleId);
  const { toast } = useToast();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FunctionalityFormData>();

  useEffect(() => {
    if (functionality) {
      reset(functionality);
    } else {
      reset({ name: "", description: "", is_active: true, submodule: submoduleId });
    }
  }, [functionality, submoduleId, reset]);

  const onSubmit = async (data: FunctionalityFormData) => {
    try {
      if (isEditMode) {
        await updateFunctionalityMutation.mutateAsync({ id: functionality.id, payload: data });
        toast({ title: "Success", description: "Functionality updated." });
      } else {
        await createFunctionalityMutation.mutateAsync(data);
        toast({ title: "Success", description: "Functionality created." });
      }
      onClose();
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "An error occurred." });
    }
  };

  const isLoading = createFunctionalityMutation.isPending || updateFunctionalityMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Functionality" : "Create New Functionality"}</DialogTitle>
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