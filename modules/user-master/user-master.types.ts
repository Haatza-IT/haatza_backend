import type { UserMaster } from "@/src/generated/prisma/client";

export type { UserMaster };

export interface MemberRegistrationDto {
  name: string;
  email: string;
  phoneNumber: string;
  passcode: string;
  status?: boolean;
  referral?: string;
  fcmToken?: string | null;
}

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

export interface EmployeeUpdateDto {
  userId: string;
  isHaatzaEmployee: boolean;
}

export interface NestExpertUpdateDto {
  userId: string;
  isNestExpert: boolean;
}

export type SanitizedUser = Omit<UserMaster, "password"> & {
  accountNumber?: string | null;
};

