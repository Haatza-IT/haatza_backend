import { z } from "zod";

// Valid Indian State Codes for GSTIN
const VALID_GSTIN_STATE_CODES = new Set([
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31", "32", "33", "34", "35", "36", "37", "38", "97", "99"
]);

/**
 * Validates Indian PAN number (10 alphanumeric characters).
 * Format: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F).
 */
export function validatePAN(pan: string): boolean {
  if (!pan || typeof pan !== "string") return false;
  const cleaned = pan.trim().toUpperCase();
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleaned);
}

/**
 * Validates Indian GSTIN using:
 * 1. 15-character length and regex structure.
 * 2. Valid 2-digit Indian state code.
 * 3. Embedded 10-character PAN format.
 * 4. Official Indian Mod-36 Checksum Algorithm for the 15th character.
 */
export function validateGSTIN(gstin: string): boolean {
  if (!gstin || typeof gstin !== "string") return false;
  const cleaned = gstin.trim().toUpperCase();

  // 1. Structure check: 15 characters
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(cleaned)) {
    return false;
  }

  // 2. Validate State Code
  const stateCode = cleaned.substring(0, 2);
  if (!VALID_GSTIN_STATE_CODES.has(stateCode)) {
    return false;
  }

  // 3. Validate Embedded PAN
  const panPart = cleaned.substring(2, 12);
  if (!validatePAN(panPart)) {
    return false;
  }

  // 4. Mod-36 Checksum Validation Algorithm
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let factor = 1;
  let sum = 0;
  const modulus = 36;

  for (let i = 0; i < 14; i++) {
    const codePoint = chars.indexOf(cleaned[i]);
    if (codePoint === -1) return false;

    let digitProduct = codePoint * factor;
    factor = factor === 1 ? 2 : 1;

    digitProduct = Math.floor(digitProduct / modulus) + (digitProduct % modulus);
    sum += digitProduct;
  }

  const remainder = sum % modulus;
  const checkCodePoint = (modulus - remainder) % modulus;
  const expectedChar = chars[checkCodePoint];

  return cleaned[14] === expectedChar;
}

export const panSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine(validatePAN, {
    message: "Invalid PAN format. Must be 10 characters (e.g., ABCDE1234F).",
  });

export const gstinSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine(validateGSTIN, {
    message: "Invalid GSTIN format, state code, embedded PAN, or checksum character.",
  });

