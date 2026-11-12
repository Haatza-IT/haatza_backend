import type { UserMaster, SanitizedUser } from '../../modules/user-master/user-master.types';

/**
 * Masks a bank account number, preserving only the last 4 digits.
 * Example: '50100123456789' -> 'XXXXXXXXXX6789'
 */
export function maskAccountNumber(accountNumber?: string | null): string | null {
  if (!accountNumber) return null;
  const trimmed = accountNumber.trim();
  if (trimmed.length <= 4) {
    return 'X'.repeat(trimmed.length);
  }
  return 'X'.repeat(trimmed.length - 4) + trimmed.slice(-4);
}

/**
 * Sanitizes user data for API responses.
 * Never exposes passwords or unmasked bank account numbers.
 */
export function sanitizeUserResponse(user: UserMaster): SanitizedUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...safeData } = user;
  return {
    ...safeData,
    accountNumber: maskAccountNumber(safeData.accountNumber),
  };
}

