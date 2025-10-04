"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taxSchema, TaxFormValues } from '@/lib/zod-schemas/taxSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface TaxFormProps {
  onSubmit: (data: TaxFormValues) => void;
  initialData?: TaxFormValues | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function TaxForm({ onSubmit, initialData = null, isSubmitting, onCancel }: TaxFormProps) {
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxSchema),
    defaultValues: initialData || {
      tax_mode: '',
      tax_code: '',
      description: '',
      central_tax: 0,
      local_tax: 0,
      surcharge: 0,
      tax_on_mrp: false,
      effective_tax_percentage: 0,
      inactive: false,
      is_mrp_inclusive: false,
      commodity_code: '',
      cess_tax: 0,
      show_tax_value_at_display: false,
      applicable_for: '',
      cess_based_on: '',
      servtax_cess_based_on: '',
      tax_computation: '',
      service_tax: 0,
      st_cess: 0,
      st_educess: 0,
      old_tax: 0,
      is_updated: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* String Fields */}
        {['tax_mode','tax_code','description','commodity_code','applicable_for','cess_based_on','servtax_cess_based_on','tax_computation'].map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof TaxFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{field.name.replace(/_/g, ' ').toUpperCase()}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Number Fields */}
        {['central_tax','local_tax','surcharge','effective_tax_percentage','cess_tax','service_tax','st_cess','st_educess','old_tax'].map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof TaxFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{field.name.replace(/_/g, ' ').toUpperCase()}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Boolean Fields */}
        {['tax_on_mrp','inactive','is_mrp_inclusive','show_tax_value_at_display','is_updated'].map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof TaxFormValues}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val === true)}
                  />
                </FormControl>
                <FormLabel className="m-0">{field.name.replace(/_/g, ' ').toUpperCase()}</FormLabel>
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
