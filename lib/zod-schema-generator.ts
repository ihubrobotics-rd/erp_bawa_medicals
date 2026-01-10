import { z, type ZodTypeAny } from "zod";

// Generates Zod schema dynamically based on field definitions
export const generateZodSchema = (functionDefinitions: any[]) => {
  const shape: Record<string, any> = {};
  functionDefinitions.forEach((field) => {
    let validator: any;
    switch (field.input_type) {
      case "number":
        validator = z
          .coerce
          .number({
            invalid_type_error: `${field.label} must be a number.`,
          })
          .nonnegative({ message: `${field.label} cannot be negative.` })
          .refine(
            (val) => !isNaN(val),
            { message: `${field.label} must be a valid number.` }
          );
        break;
          //EMail FIELD TYPE
      case "email":
        validator = z.string().email({ message: "Invalid email format" });
        break;

      // Checkbox fields
      case "checkbox":
        validator = z.boolean();
        break;

      // Radio fields
      case "radio": {
        const values = field.values?.map((v: any) => v.value) ?? []

        const isBooleanField = values.every(
          (v: any) =>
            v === true ||
            v === false ||
            v === "true" ||
            v === "false"
        )

        if (isBooleanField) {
          validator = z
            .union([
              z.boolean(),
              z.literal("true"),
              z.literal("false"),
            ])
            .transform((val) => val === true || val === "true")
        } else if (Array.isArray(values) && values.length > 0) {
          const literalValues = values.map((v: any) => z.literal(String(v)))
          if (literalValues.length === 1) {
            validator = literalValues[0]
          } else {
            const [first, second, ...rest] = literalValues
            validator = z.union(
              [first, second, ...rest] as [
                ZodTypeAny,
                ZodTypeAny,
                ...ZodTypeAny[],
              ],
            )
          }
        } else {
          validator = z.string()
        }
        break
      }
      // Default case — treat as string input
      default:
        validator = z.string();
        break;
    }

    // Apply required/optional rule
    if (field.is_required) {
      const typeName = (validator as any)?._def?.typeName;

      if (typeName === "ZodString") {
        validator = validator.min(1, { message: `${field.label} is required.` });
      } else if (typeName === "ZodNumber") {
        validator = validator.refine(
          (val: unknown) => val !== null && val !== undefined,
          { message: `${field.label} is required.` }
        );
      }
    } else {
      validator = validator.optional().nullable();
    }
    shape[field.input_name] = validator;
  })
  return z.object(shape);
};
