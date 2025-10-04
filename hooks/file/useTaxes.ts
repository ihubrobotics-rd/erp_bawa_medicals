// hooks/file/useTaxes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as fileApi from '@/lib/api/fileApi';
import { TaxFormValues } from '@/lib/zod-schemas/taxSchema';
import { toast } from 'sonner';

const TAXES_QUERY_KEY = ['taxes'];

export function useTaxes() {
  const queryClient = useQueryClient();

  const getTaxesQuery = useQuery({
    queryKey: TAXES_QUERY_KEY,
    queryFn: fileApi.getTaxes,
  });

  const createTaxMutation = useMutation({
    mutationFn: (data: TaxFormValues) => fileApi.createTax(data),
    onSuccess: () => {
      toast.success('Tax created successfully!');
      queryClient.invalidateQueries({ queryKey: TAXES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(`Failed to create tax: ${error.message}`);
    },
  });

  const updateTaxMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaxFormValues }) => fileApi.updateTax({ id, data }),
    onSuccess: () => {
      toast.success('Tax updated successfully!');
      queryClient.invalidateQueries({ queryKey: TAXES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(`Failed to update tax: ${error.message}`);
    },
  });

  const deleteTaxMutation = useMutation({
    mutationFn: (id: number) => fileApi.deleteTax(id),
    onSuccess: () => {
      toast.success('Tax deactivated successfully!');
      queryClient.invalidateQueries({ queryKey: TAXES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(`Failed to deactivate tax: ${error.message}`);
    },
  });

  return { 
    getTaxesQuery, 
    createTaxMutation, 
    updateTaxMutation, 
    deleteTaxMutation 
  };
}