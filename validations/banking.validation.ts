import { z } from "zod";

/**
 * Validates Indian IFSC Code (11 alphanumeric characters).
 * Format: 4 uppercase letters, '0', 6 alphanumeric characters.
 * Example: HDFC0000060, SBIN0001234
 */
export function validateIFSC(ifsc: string): boolean {
  if (!ifsc || typeof ifsc !== "string") return false;
  const cleaned = ifsc.trim().toUpperCase();
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleaned);
}

/**
 * Validates Bank Account Number.
 * Must be a numeric string preserving leading zeros, 9 to 18 digits.
 */
export function validateAccountNumber(accountNumber: string): boolean {
  if (!accountNumber || typeof accountNumber !== "string") return false;
  const cleaned = accountNumber.trim();
  return /^\d{9,18}$/.test(cleaned);
}

export const ifscSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine(validateIFSC, {
    message: "Invalid IFSC code. Format: 4 uppercase letters, '0', followed by 6 alphanumeric characters.",
  });

export const accountNumberSchema = z
  .string()
  .trim()
  .refine(validateAccountNumber, {
    message: "Invalid bank account number. Must contain 9 to 18 numeric digits.",
  });

