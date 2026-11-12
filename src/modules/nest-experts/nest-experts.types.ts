import type { UserMaster } from '../../generated/prisma/client';

export interface NestExpertUpdateDto {
  userId: string;
  isNestExpert: boolean;
}

export type SanitizedNestExpert = Omit<UserMaster, 'password'>;

export interface NestExpertResponse {
  success: boolean;
  message: string;
  data: SanitizedNestExpert;
}

export const NEST_EXPERT_MESSAGES = {
  UPDATED_SUCCESS: 'Haatza Nest Expert status updated successfully',
  USER_NOT_FOUND: 'User not found with the specified userId',
} as const;

