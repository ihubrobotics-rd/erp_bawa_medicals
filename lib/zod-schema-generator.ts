// lib/zod-schema-generator.ts

import { z } from "zod";

// Generates Zod schema dynamically based on field definitions
export const generateZodSchema = (functionDefinitions: any[]) => {
  const shape: Record<string, any> = {};

  functionDefinitions.forEach((field) => {
    let validator: any;

    switch (field.input_type) {
      case "number":
        validator = z.coerce.number({
          invalid_type_error: `${field.label} must be a number.`,
        })
        // --- ADD THIS LINE ---
        .nonnegative({ message: `${field.label} cannot be negative.` });
        break;

      case "email":
        validator = z.string().email({ message: "Invalid email format" });
        break;

      case "checkbox":
        validator = z.boolean();
        break;

      case "radio": {
        // check if radio field represents a boolean-like field
        const values = field.values?.map((v: any) => v.value) ?? [];

        const isBooleanField = values.every(
          (v: any) =>
            v === true ||
            v === false ||
            v === "true" ||
            v === "false"
        );

        if (isBooleanField) {
          // accepts string or boolean → outputs boolean
          validator = z
            .union([
              z.boolean(),
              z.literal("true"),
              z.literal("false"),
            ])
            .transform((val) => val === true || val === "true");
        } else if (Array.isArray(values) && values.length > 0) {
          // handle string-based radios
          validator = z.union(values.map((v: any) => z.literal(String(v))));
        } else {
          validator = z.string();
        }
        break;
      }

      default:
        validator = z.string();
        break;
    }

    // Apply required/optional rule
    if (field.is_required) {
      const typeName = (validator as any)?._def?.typeName;

      if (typeName === "ZodString") {
        validator = validator.min(1, { message: `${field.label} is required.` });
      }
    } else {
      validator = validator.optional().nullable();
    }

    shape[field.input_name] = validator;
  });

  return z.object(shape);
};