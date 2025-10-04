import { z } from 'zod';

export const taxSchema = z.object({
  tax_mode: z.string(),
  tax_code: z.string(),
  description: z.string(),
  central_tax: z.number(),
  local_tax: z.number(),
  surcharge: z.number(),
  tax_on_mrp: z.boolean(),
  effective_tax_percentage: z.number(),
  inactive: z.boolean(),
  is_mrp_inclusive: z.boolean(),
  commodity_code: z.string(),
  cess_tax: z.number(),
  show_tax_value_at_display: z.boolean(),
  applicable_for: z.string(),
  cess_based_on: z.string(),
  servtax_cess_based_on: z.string(),
  tax_computation: z.string(),
  service_tax: z.number(),
  st_cess: z.number(),
  st_educess: z.number(),
  old_tax: z.number(),
  is_updated: z.boolean(),
});

export type TaxFormValues = z.infer<typeof taxSchema>;
