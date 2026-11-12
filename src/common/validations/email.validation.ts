import { z } from 'zod';

/**
 * Validates and normalizes email addresses.
 * Trims whitespace and transforms to lowercase.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email address format');

