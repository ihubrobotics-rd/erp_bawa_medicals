import { z } from "zod";

// This utility function creates a Zod validation schema from your API's form definition
export const generateZodSchema = (functionDefinitions: any[]) => {
  const shape: { [key: string]: any } = {};

  functionDefinitions.forEach((field) => {
    let validator: any;

    switch (field.input_type) {
      case "number":
        // `coerce` will convert the string from the input field into a number
        validator = z.coerce.number({
          invalid_type_error: `${field.label} must be a number.`,
        });
        break;

      case "email":
        validator = z.string().email();
        break;

      case "checkbox":
        // Checkbox should be a boolean
        validator = z.boolean();
        break;

      case "radio":
        // If radio options are provided, create an enum of allowed values
        if (Array.isArray(field.values) && field.values.length > 0) {
          const enumValues = field.values.map((v: any) => String(v.value));
          // z.enum requires a tuple of string literals at compile time; use z.union as a runtime-friendly alternative
          validator = z.union(enumValues.map((v: string) => z.literal(v)));
        } else {
          // fallback to string
          validator = z.string();
        }
        break;

      default: // 'text', 'select', and others
        validator = z.string();
    }

    // Apply required/optional rules depending on the base validator type
    if (field.is_required) {
      // For strings, ensure non-empty values
      if (validator === z.string) {
        // This branch won't be hit because validator is an instance, so handle via typeof check below
      }

      // If validator is a Zod string instance, apply min(1)
      // We detect string validators by checking for ._def.typeName
      try {
        const typeName = (validator as any)?._def?.typeName;
        if (typeName === "ZodString") {
          validator = (validator as any).min(1, {
            message: `${field.label} is required.`,
          });
        }
        // For unions (like radio union), we don't need min(1) — presence is enough
      } catch (e) {
        // ignore and leave validator as-is
      }
    } else {
      validator = validator.optional();
    }

    shape[field.input_name] = validator;
  });

  return z.object(shape);
};
