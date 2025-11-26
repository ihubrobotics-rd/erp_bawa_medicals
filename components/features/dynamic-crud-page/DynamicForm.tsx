'use client';

import { useEffect, useState, useRef } from "react";
import { useForm, Controller, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api/auth";
import { generateZodSchema } from "@/lib/zod-schema-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DynamicDropdown, StaticDropdown } from "./DropdownFields";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; 
import { useApiErrorHandler } from "@/hooks/useError";

// Define types - Updated to match actual usage
interface FieldSchema {
  id: string;
  input_name: string;
  label: string;
  is_required?: boolean;
  input_type?: string;
  placeholder?: string;
  values?: Array<{ label: string; value: string }> | string; // Can be array or string
  options_api?: string;
  detail_api?: string;
  mapping?: string;
}

interface DynamicFormProps {
  schema: FieldSchema[];
  apiCreateRoute: string;
  apiUpdateRoute: string;
  apiGetAllRoute: string;
  initialData?: Record<string, any> | null;
  onClose: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const defaultRadioOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

export function DynamicForm({
  schema,
  apiCreateRoute,
  apiUpdateRoute,
  apiGetAllRoute,
  initialData = null,
  onClose,
  onDirtyChange,
}: DynamicFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const initialDataRef = useRef(initialData);
  const { handleError } = useApiErrorHandler();

  const formSchema = generateZodSchema(schema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    watch,
    setError
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  // Reset form when editing
  useEffect(() => {
    if (isEditMode && initialData) {
      reset(initialData);
      initialDataRef.current = initialData;
    }
  }, [initialData, reset, isEditMode]);

  // Watch for manual user input
  const watchedValues = watch();

  useEffect(() => {
    if (!onDirtyChange) return;

    const hasInput = Object.keys(watchedValues).some((key) => {
      const val = watchedValues[key];
      const initial = initialDataRef.current ? initialDataRef.current[key] ?? "" : "";
      return val !== "" && val !== null && val !== undefined && val !== initial;
    });

    onDirtyChange(hasInput);
  }, [watchedValues, onDirtyChange]);

  const mutation = useMutation({
    mutationFn: async (formData: Record<string, any>) => {
      const endpoint = isEditMode
        ? apiUpdateRoute.replace("<int:pk>", String(initialData?.id))
        : apiCreateRoute;
      const method = isEditMode ? api.put : api.post;
      const res = await method(endpoint, formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          (isEditMode ? "Updated successfully!" : "Created successfully!")
      );
      queryClient.invalidateQueries({
        queryKey: ["tableData", apiGetAllRoute],
      });
      onDirtyChange?.(false);
      onClose();
    },
     onError: (error: any) => {
    const { generalMessage } = handleError(error, (field, msg) => {
      setError(field, { message: msg });
    });

    // Show only the general backend message
    toast.error(generalMessage);
  },
});

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const sanitizedData = { ...data };
    Object.keys(sanitizedData).forEach((key) => {
      if (sanitizedData[key] === "true") sanitizedData[key] = true;
      else if (sanitizedData[key] === "false") sanitizedData[key] = false;
      if (sanitizedData[key] === "" || sanitizedData[key] === null) {
        delete sanitizedData[key];
      }
    });
    mutation.mutate(sanitizedData);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {schema.map((field) => (
            <div key={field.id} className="overflow-hidden wrap-break-word whitespace-normal">
              <Label htmlFor={field.input_name} className="capitalize font-medium">
                {field.label.replace(/_/g, " ")}
                {field.is_required && <span className="text-red-500">*</span>}
              </Label>

              <div>
                {(() => {
                  if (field.input_type === "checkbox") {
                    return (
                      <Controller
                        control={control}
                        name={field.input_name}
                        render={({ field: ctrl }) => (
                          <div className="pt-2">
                            <Checkbox
                              id={field.input_name}
                              checked={!!ctrl.value}
                              onCheckedChange={ctrl.onChange}
                            />
                          </div>
                        )}
                      />
                    );
                  }

                  if (field.input_type === "radio") {
                    // Type guard to check if values is an array
                    const radioOptions = (Array.isArray(field.values) && field.values.length)
                      ? field.values
                      : defaultRadioOptions;
                    return (
                      <Controller
                        control={control}
                        name={field.input_name}
                        render={({ field: ctrl }) => (
                          <RadioGroup
                            onValueChange={ctrl.onChange}
                            value={String(ctrl.value ?? "")}
                            className="flex flex-wrap gap-3 pt-2"
                          >
                            {radioOptions.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={option.value}
                                  id={`${field.input_name}-${option.value}`}
                                />
                                <Label
                                  htmlFor={`${field.input_name}-${option.value}`}
                                  className="text-sm font-normal"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      />
                    );
                  }

                  if (field.options_api) {
                    return (
                      <DynamicDropdown
                        field={field}
                        schema={schema}
                        setValue={setValue}
                        watch={watch}
                      />
                    );
                  }

                  if (field.values && field.input_type !== "radio") {
                    return (
                      <StaticDropdown field={field} setValue={setValue} watch={watch} />
                    );
                  }

                  return (
                    <Input
                      id={field.input_name}
                      type={field.input_type || "text"}
                      placeholder={field.placeholder}
                      {...register(field.input_name)}
                      min={field.input_type === "number" ? 0 : undefined}
                      step={field.input_type === "number" ? "any" : undefined}
                      onKeyDown={(e) => {
                        if (field.input_type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="mt-2"
                    />
                  );
                })()}

                {errors[field.input_name] && (
                  <p className="text-xs text-red-500 mt-1">
                    {String(errors[field.input_name]?.message || "")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-end gap-3 border-t pt-6 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const hasChanges = Object.keys(watchedValues).some((key) => {
                const val = watchedValues[key];
                const initial = initialDataRef.current ? initialDataRef.current[key] ?? "" : "";
                return val !== "" && val !== null && val !== undefined && val !== initial;
              });

              if (hasChanges) {
                setIsCancelAlertOpen(true);
              } else {
                onDirtyChange?.(false);
                onClose();
              }
            }}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? "Saving..."
              : isEditMode
              ? "Update Changes"
              : "Save"}
          </Button>
        </div>
      </form>

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this page? Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on page</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsCancelAlertOpen(false);
                onDirtyChange?.(false);
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}