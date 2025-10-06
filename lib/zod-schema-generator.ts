import { z } from 'zod';

// This utility function creates a Zod validation schema from your API's form definition
export const generateZodSchema = (functionDefinitions: any[]) => {
  const shape: { [key: string]: any } = {};
  
  functionDefinitions.forEach(field => {
    let validator;
    switch (field.input_type) {
      case 'number':
        // `coerce` will convert the string from the input field into a number
        validator = z.coerce.number({ invalid_type_error: `${field.label} must be a number.` });
        break;
      case 'email':
        validator = z.string().email();
        break;
      default: // 'text', and others
        validator = z.string();
    }
    
    if (field.is_required) {
      if(field.input_type !== 'number'){
          validator = validator.min(1, { message: `${field.label} is required.` });
      }
    } else {
        validator = validator.optional();
    }
    
    shape[field.input_name] = validator;
  });

  return z.object(shape);
};