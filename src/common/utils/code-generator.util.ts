import crypto from 'crypto';

/**
 * Generates a random alphanumeric referral code with 'HZ' prefix.
 * Omits ambiguous characters like 0, O, 1, I to ensure readability.
 * Example: HZ9M2P5R
 */
export function generateRandomReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  const randomBytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    randomPart += chars[randomBytes[i] % chars.length];
  }
  return `HZ${randomPart}`;
}

/**
 * Generates a unique seller ID string with 'HSL-' prefix.
 * Example: HSL-A1B2C3D4
 */
export function generateRandomSellerId(): string {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `HSL-${hex}`;
}

