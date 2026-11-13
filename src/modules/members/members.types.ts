export interface MemberRegistrationDto {
  name: string;
  email: string;
  phoneNumber: string;
  passcode: string;
  status?: boolean;
  referral?: string;
  referralCode?: string;
  fcmToken?: string | null;
}

/**
 * Dedicated response DTO containing strictly the 6 required public member fields.
 */
export interface RegisteredMemberData {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  status: boolean;
}

export interface MemberResponse {
  success: true;
  message: string;
  data: RegisteredMemberData;
}

/**
 * Dedicated serializer for member registration response.
 * Strips all internal, seller, employee, banking, tax, and null fields.
 */
export function serializeRegisteredMember(user: {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  status: boolean;
}): RegisteredMemberData {
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    referralCode: user.referralCode,
    status: user.status,
  };
}

export const MEMBER_MESSAGES = {
  REGISTERED_SUCCESS: 'Haatza member registered successfully',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PHONE_ALREADY_EXISTS: 'Phone number already exists',
} as const;
