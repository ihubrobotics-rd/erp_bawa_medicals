// hooks/useApiErrorHandler.ts
import { useCallback } from 'react';

interface ApiErrorResponse {
  status?: string;
  message?: any;
  data?: Record<string, string[] | string>;
  errors?: Record<string, string[] | string>;
}

export function useApiErrorHandler() {
  const handleError = useCallback(
    (error: any, setError?: (field: string, message: string) => void) => {
      const errorData: ApiErrorResponse = error?.response?.data || error;

      let generalMessage = "An unexpected error occurred.";

      // If message is a string → use it
      if (typeof errorData.message === "string") {
        generalMessage = errorData.message;
      }

      // If message is an object → extract the first error inside it
      else if (
        typeof errorData.message === "object" &&
        errorData.message !== null
      ) {
        const firstKey = Object.keys(errorData.message)[0];
        const firstVal = errorData.message[firstKey];

        generalMessage = Array.isArray(firstVal)
          ? firstVal[0]
          : String(firstVal);
      }

      let hasFieldErrors = false;

      const errorSources = [errorData.data, errorData.errors].filter(Boolean);

      for (const errorSource of errorSources) {
        if (errorSource && typeof errorSource === "object") {
          for (const [field, messages] of Object.entries(errorSource)) {
            const message = Array.isArray(messages) ? messages[0] : messages;

            if (setError) {
              setError(field, message);
              hasFieldErrors = true;
            }
          }
        }
      }

      return { generalMessage, hasFieldErrors };
    },
    []
  );

  return { handleError };
}
