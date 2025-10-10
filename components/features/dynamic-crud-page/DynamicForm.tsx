'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api/auth';
import { generateZodSchema } from '@/lib/zod-schema-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DynamicDropdown, StaticDropdown } from './DropdownFields';

type DynamicFormProps = {
  schema: any[];
  apiCreateRoute: string;
  apiUpdateRoute: string;
  apiGetAllRoute: string;
  initialData?: any | null;
  onClose: () => void;
};

// --- 1. Define default options for radio buttons ---
// We will use these if the API doesn't provide specific options.
const defaultRadioOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];


export function DynamicForm({
  schema,
  apiCreateRoute,
  apiUpdateRoute,
  apiGetAllRoute,
  initialData = null,
  onClose,
}: DynamicFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const formSchema = generateZodSchema(schema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (isEditMode) {
      reset(initialData);
    }
  }, [initialData, reset, isEditMode]);

// --- CREATE MUTATION ---
const createMutation = useMutation({
  mutationFn: async (newData: any) => {
    const res = await api.post(apiCreateRoute, newData);
    return res.data; // so we can access .message
  },
  onSuccess: (data) => {
    const message = data?.message || "Item created successfully!";
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['tableData', apiGetAllRoute] });
    onClose();
  },
  onError: (error: any) => {
    const backendData = error?.response?.data;
    const message = backendData?.message || "Failed to create item.";
    const fieldErrors = backendData?.errors || {};

    let details = "";
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      details += `\n${field}: ${(messages as string[]).join(", ")}`;
    });

    toast.error(`${message}${details ? "\n" + details : ""}`);
    console.error("Create Error:", error);
  },
});

// --- UPDATE MUTATION ---
const updateMutation = useMutation({
  mutationFn: async (updatedData: any) => {
    const updateUrl = apiUpdateRoute.replace("<int:pk>", String(initialData.id));
    const res = await api.put(updateUrl, updatedData);
    return res.data;
  },
  onSuccess: (data) => {
    const message = data?.message || "Item updated successfully!";
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['tableData', apiGetAllRoute] });
    onClose();
  },
  onError: (error: any) => {
    const backendData = error?.response?.data;
    const message = backendData?.message || "Failed to update item.";
    const fieldErrors = backendData?.errors || {};

    let details = "";
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      details += `\n${field}: ${(messages as string[]).join(", ")}`;
    });

    toast.error(`${message}${details ? "\n" + details : ""}`);
    console.error("Update Error:", error);
  },
});

  const onSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
        // Convert 'true'/'false' strings from radio/checkboxes back to booleans if applicable
        if (data[key] === 'true') {
            data[key] = true;
        } else if (data[key] === 'false') {
            data[key] = false;
        }
        if (data[key] === '') delete data[key];
    });

    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    // --- 4. Removed space-y-4 as the new grid gap handles spacing ---
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* --- 3. Add a grid layout wrapper for a better UI --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {schema.map((field) => (
          <div key={field.id} className="grid w-full items-center gap-1.5">
            <Label htmlFor={field.input_name} className="capitalize">
              {field.label} {field.is_required && <span className="text-red-500">*</span>}
            </Label>

            {(() => {
              if (field.input_type === 'checkbox') {
                return (
                  <Controller
                    control={control}
                    name={field.input_name}
                    render={({ field: controllerField }) => (
                      <div className="flex items-center pt-2">
                          <Checkbox
                            id={field.input_name}
                            checked={!!controllerField.value}
                            onCheckedChange={controllerField.onChange}
                          />
                      </div>
                    )}
                  />
                );
              }

              if (field.input_type === 'radio') {
                // --- 2. Use the default options if field.values is not provided ---
                const radioOptions = (field.values && field.values.length > 0) 
                  ? field.values 
                  : defaultRadioOptions;

                return (
                  <Controller
                    control={control}
                    name={field.input_name}
                    render={({ field: controllerField }) => (
                      <RadioGroup
                        onValueChange={controllerField.onChange}
                        // Ensure the value from the form state (which could be boolean) is a string
                        value={String(controllerField.value)}
                        className="flex space-x-4 pt-2"
                      >
                        {radioOptions.map((option: any) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${field.input_name}-${option.value}`} />
                            <Label htmlFor={`${field.input_name}-${option.value}`}>{option.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                );
              }
              
              if (field.options_api) {
                return <DynamicDropdown field={field} setValue={setValue} />;
              }
              
              if (field.values && field.input_type !== 'radio') {
                return <StaticDropdown field={field} setValue={setValue} />;
              }

              return (
                <Input
                  id={field.input_name}
                  type={field.input_type || 'text'}
                  placeholder={field.placeholder}
                  {...register(field.input_name)}
                />
              );
            })()}
            
            {errors[field.input_name] && (
              <p className="text-sm text-red-500">
                {errors[field.input_name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-8"> {/* Increased top padding for separation */}
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : (isEditMode ? 'Update Changes' : 'Save')}
        </Button>
      </div>
    </form>
  );
}