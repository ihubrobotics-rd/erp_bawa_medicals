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
}) {
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  // Generate a Zod schema dynamically from the API definition
  const formSchema = generateZodSchema(schema);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    watch, 
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  // Effect to reset the form when in edit mode and the data changes
  useEffect(() => {
    if (isEditMode && initialData) {
      reset(initialData);
    }
  }, [initialData, reset, isEditMode]);

  // Mutation for creating or updating data
  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      const endpoint = isEditMode
        ? apiUpdateRoute.replace('<int:pk>', String(initialData.id))
        : apiCreateRoute;

      const method = isEditMode ? api.put : api.post;
      const res = await method(endpoint, formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || (isEditMode ? 'Updated successfully!' : 'Created successfully!'));
      queryClient.invalidateQueries({ queryKey: ['tableData', apiGetAllRoute] });
      onClose(); // Close the dialog/modal on success
    },
    onError: (error: any) => {
      const backendData = error?.response?.data || {};
      const message = backendData?.message || 'An unexpected error occurred.';
      const fieldErrors = backendData?.errors || {};

      // Format and display backend validation errors
      const details = Object.entries(fieldErrors)
        .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
        .join('\n');

      toast.error(`${message}${details ? '\n' + details : ''}`);
    },
  });

  // Handler for form submission
  const onSubmit = (data: any) => {
    // Sanitize data before sending to the API
    const sanitizedData = { ...data };
    Object.keys(sanitizedData).forEach((key) => {
      if (sanitizedData[key] === 'true') sanitizedData[key] = true;
      else if (sanitizedData[key] === 'false') sanitizedData[key] = false;
      if (sanitizedData[key] === '' || sanitizedData[key] === null) {
        delete sanitizedData[key];
      }
    });
    mutation.mutate(sanitizedData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-6"
    >
      {/* Responsive grid for form fields */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {schema.map((field) => (
          <div key={field.id} className="flex flex-col">
            <Label htmlFor={field.input_name} className="capitalize font-medium">
              {field.label.replace(/_/g, ' ')}
              {field.is_required && <span className="text-red-500">*</span>}
            </Label>

            {/* Dynamic rendering of different input types */}
            {(() => {
              if (field.input_type === 'checkbox') {
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

              if (field.input_type === 'radio') {
                const radioOptions = field.values?.length ? field.values : defaultRadioOptions;
                return (
                  <Controller
                    control={control}
                    name={field.input_name}
                    render={({ field: ctrl }) => (
                      <RadioGroup
                        onValueChange={ctrl.onChange}
                        value={String(ctrl.value)}
                        className="flex flex-wrap gap-3 pt-2"
                      >
                        {radioOptions.map((option: any) => (
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
                    schema={schema} // Pass the full schema for dependency checks
                    setValue={setValue}
                    watch={watch} // Pass watch to make it a controlled component
                  />
                );
              }

              if (field.values && field.input_type !== 'radio') {
                return (
                  <StaticDropdown
                    field={field}
                    setValue={setValue}
                    watch={watch} // Pass watch for consistency
                  />
                );
              }

              return (
                <Input
                  id={field.input_name}
                  type={field.input_type || 'text'}
                  placeholder={field.placeholder}
                  {...register(field.input_name)}
                  className="mt-2"
                />
              );
            })()}

            {errors[field.input_name] && (
              <p className="text-xs text-red-500 mt-1">
                {errors[field.input_name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col justify-end gap-3 border-t pt-6 sm:flex-row">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? 'Saving...'
            : isEditMode
            ? 'Update Changes'
            : 'Save'}
        </Button>
      </div>
    </form>
  );
}