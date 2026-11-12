import { z } from 'zod';

/**
 * Validates Indian PIN code (exactly six numeric digits).
 */
export function validatePinCode(pin: string): boolean {
  if (!pin || typeof pin !== 'string') return false;
  return /^\d{6}$/.test(pin.trim());
}

export const pinCodeSchema = z
  .string()
  .trim()
  .refine(validatePinCode, {
    message: 'PIN code must contain exactly six numeric digits.',
  });

export const passcodeSchema = z
  .string()
  .min(6, 'Passcode must be at least 6 characters long')
  .max(128, 'Passcode is too long');

export const latitudeSchema = z
  .number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90');

export const longitudeSchema = z
  .number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180');

export const uuidSchema = z
  .string()
  .uuid('userId must be a valid UUID');

