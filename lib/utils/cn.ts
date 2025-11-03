import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names conditionally
 * Uses clsx for conditional class merging
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

