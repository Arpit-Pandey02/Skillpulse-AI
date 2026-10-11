import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to conditionally merge Tailwind CSS class names
 * without class precedence conflicts.
 * 
 * Example:
 * cn('px-4 py-2 bg-indigo-600', isOutlined && 'bg-transparent border border-indigo-600')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
