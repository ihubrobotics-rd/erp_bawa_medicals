'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form'; // 1. Import Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api/auth';
import { generateZodSchema } from '@/lib/zod-schema-generator';

// 2. Import the new UI components
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
    control, // 3. Get 'control' from useForm
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (isEditMode) {
      reset(initialData);
    }
  }, [initialData, reset, isEditMode]);

  const createMutation = useMutation({
    mutationFn: (newData: any) => api.post(apiCreateRoute, newData),
    onSuccess: () => {
      toast.success('Item created successfully!');
      queryClient.invalidateQueries({ queryKey: ['tableData', apiGetAllRoute] });
      onClose();
    },
    onError: (error) => {
      toast.error('Failed to create item.');
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: any) => {
      const updateUrl = apiUpdateRoute.replace('<int:pk>', initialData.id);
      return api.put(updateUrl, updatedData);
    },
    onSuccess: () => {
      toast.success('Item updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['tableData', apiGetAllRoute] });
      onClose();
    },
    onError: (error) => {
      toast.error('Failed to update item.');
      console.error(error);
    },
  });

  const onSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {schema.map((field) => (
        <div key={field.id} className="grid w-full items-center gap-1.5">
          <Label htmlFor={field.input_name} className="capitalize">
            {field.label} {field.is_required && <span className="text-red-500">*</span>}
          </Label>

          {/* --- 4. START: UPDATED COMPONENT RENDERING LOGIC --- */}
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
                          checked={!!controllerField.value} // Use !! to ensure it's a boolean
                          onCheckedChange={controllerField.onChange}
                       />
                    </div>
                  )}
                />
              );
            }

            if (field.input_type === 'radio') {
              // This assumes your radio options are in `field.values`
              // e.g., field.values = [{ label: 'Option 1', value: 'opt1' }, ...]
              return (
                <Controller
                  control={control}
                  name={field.input_name}
                  render={({ field: controllerField }) => (
                    <RadioGroup
                      onValueChange={controllerField.onChange}
                      defaultValue={controllerField.value}
                      className="flex space-x-4 pt-2"
                    >
                      {(field.values || []).map((option: any) => (
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
            
            // Render dropdown if `values` exist, but it's not a radio group
            if (field.values && field.input_type !== 'radio') {
              return <StaticDropdown field={field} setValue={setValue} />;
            }

            // Fallback to a standard text input
            return (
              <Input
                id={field.input_name}
                type={field.input_type || 'text'}
                placeholder={field.placeholder}
                {...register(field.input_name)}
              />
            );
          })()}
          {/* --- END: UPDATED COMPONENT RENDERING LOGIC --- */}
          
          {errors[field.input_name] && (
            <p className="text-sm text-red-500">
              {errors[field.input_name]?.message as string}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-2 pt-4">
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