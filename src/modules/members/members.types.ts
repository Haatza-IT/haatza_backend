import type { UserMaster } from '../../generated/prisma/client';

export interface MemberRegistrationDto {
  name: string;
  email: string;
  phoneNumber: string;
  passcode: string;
  status?: boolean;
  referral?: string;
  fcmToken?: string | null;
}

export type SanitizedMember = Omit<UserMaster, 'password'>;

export interface MemberResponse {
  success: boolean;
  message: string;
  data: SanitizedMember;
}

export const MEMBER_MESSAGES = {
  REGISTERED_SUCCESS: 'Haatza member registered successfully',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PHONE_ALREADY_EXISTS: 'Phone number already exists',
} as const;

