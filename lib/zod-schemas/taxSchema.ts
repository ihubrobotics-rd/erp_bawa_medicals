import { z } from "zod"

export const taxFormSchema = z.object({
  name: z.string().min(1, "Tax name is required"),
  rate: z
    .number({
      required_error: "Rate is required",
      invalid_type_error: "Rate must be a number",
    })
    .min(0, "Rate cannot be negative"),
  isActive: z.boolean(),
})

export type TaxFormValues = z.infer<typeof taxFormSchema>

