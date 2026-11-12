import type { UserMaster } from '../../generated/prisma/client';

export interface SellerRegistrationDto {
  name: string;
  email: string;
  phoneNumber: string;
  passcode: string;
  fcmToken?: string | null;
  referral?: string;
  sellerAddress1?: string | null;
  sellerAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pinCode?: string | null;
  sellerPickupAddress?: string | null;
  pickupLocationId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bankName?: string | null;
  accountHolderName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  accountManager?: string | null;
  gstin?: string | null;
  companyName?: string | null;
  panNumber?: string | null;
  isGSTRegistered?: boolean;
}

export type SanitizedSeller = Omit<UserMaster, 'password'>;

export interface SellerResponse {
  success: boolean;
  message: string;
  data: SanitizedSeller;
}

export const SELLER_MESSAGES = {
  REGISTERED_SUCCESS: 'Haatza seller registered successfully',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PHONE_ALREADY_EXISTS: 'Phone number already exists',
} as const;
