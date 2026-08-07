/**
 * ===========================================
 * UTILITY FUNCTIONS
 * ===========================================
 * 
 * Helper functions used throughout the app
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
