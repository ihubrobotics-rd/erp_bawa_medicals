// lib/utils.ts (The CORRECTED file)

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This function is for your UI components (keep it!)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this new function for your dynamic routing
export const toSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, ''); // Remove all non-word chars
};