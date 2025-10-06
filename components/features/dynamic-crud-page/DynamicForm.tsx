'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api from '@/lib/api/auth';
import { generateZodSchema } from '@/lib/zod-schema-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DynamicFormProps = {
  schema: any[]; // This is the `function_definitions` array
  apiCreateRoute: string;
  apiGetAllRoute: string; // Needed to invalidate query cache on success
  onClose: () => void; // Function to close the modal
};

export function DynamicForm({ schema, apiCreateRoute, apiGetAllRoute, onClose }: DynamicFormProps) {
  const queryClient = useQueryClient();

  // 1. Generate the Zod schema dynamically
  const formSchema = generateZodSchema(schema);
  
  // 2. Setup React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  // 3. Setup the mutation for creating a new item
  const createMutation = useMutation({
    mutationFn: (newData: any) => api.post(apiCreateRoute, newData),
    onSuccess: () => {
      toast.success('Item created successfully!');
      // When creation is successful, refetch the table data to show the new item
      queryClient.invalidateQueries({ queryKey: ['tableData', apiGetAllRoute] });
      onClose(); // Close the form/modal
    },
    onError: (error) => {
      toast.error('Failed to create item.');
      console.error(error);
    },
  });

  // 4. The function that is called on form submission
  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  // 5. Render the form fields based on the schema
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {schema.map((field) => (
        <div key={field.id} className="grid w-full items-center gap-1.5">
          <Label htmlFor={field.input_name} className='capitalize'>
            {field.label} {field.is_required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={field.input_name}
            type={field.input_type}
            placeholder={field.placeholder}
            {...register(field.input_name)}
          />
          {errors[field.input_name] && (
            <p className="text-sm text-red-500">{errors[field.input_name]?.message as string}</p>
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
      </div>
    </form>
  );
}