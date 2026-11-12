import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Hashes a plain-text passcode using bcrypt with a work factor of 12.
 * Never logs or reveals plain text or hashes.
 *
 * @param passcode - Plain text password provided by the user
 * @returns Promise<string> - The resulting bcrypt hash
 */
export async function hashPassword(passcode: string): Promise<string> {
  return bcrypt.hash(passcode, BCRYPT_SALT_ROUNDS);
}

/**
 * Verifies a plain-text password against a stored bcrypt hash.
 *
 * @param passcode - Plain text password to check
 * @param hash - Stored bcrypt hash from the database
 * @returns Promise<boolean> - True if matches, false otherwise
 */
export async function verifyPassword(passcode: string, hash: string): Promise<boolean> {
  return bcrypt.compare(passcode, hash);
}

