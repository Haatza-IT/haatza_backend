import { z } from "zod";

/**
 * Normalizes and validates Indian phone numbers.
 * Accepts:
 * - 10 digits starting with 6, 7, 8, or 9
 * - Prefixed with +91 (e.g. +919876543210)
 * - Prefixed with 91 (e.g. 919876543210)
 * - Prefixed with 0 (e.g. 09876543210)
 *
 * Returns cleaned 10-digit phone number, or null if invalid.
 */
export function normalizeAndValidatePhone(phone: string): string | null {
  if (!phone || typeof phone !== "string") return null;
  let cleaned = phone.trim().replace(/[\s\-()]/g, "");

  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

/**
 * Zod schema for Indian phone numbers.
 * Enforces valid format and transforms into cleaned 10-digit string.
 */
export const phoneSchema = z
  .string()
  .trim()
  .refine((val) => normalizeAndValidatePhone(val) !== null, {
    message: "Invalid phone number. Must be a valid 10-digit Indian phone number starting with 6-9.",
  })
  .transform((val) => normalizeAndValidatePhone(val)!);

