import prisma from "@/lib/prisma";
import type { UserMaster } from "./user-master.types";

/**
 * User Master Repository Layer
 * Exclusively responsible for executing database queries via Prisma Client.
 */
export class UserMasterRepository {
  /**
   * Finds a user by their unique userId.
   */
  static async findById(userId: string): Promise<UserMaster | null> {
    return prisma.userMaster.findUnique({
      where: { userId },
    });
  }

  /**
   * Finds a user by their unique email.
   */
  static async findByEmail(email: string): Promise<UserMaster | null> {
    return prisma.userMaster.findUnique({
      where: { email },
    });
  }

  /**
   * Finds a user by their unique phone number.
   */
  static async findByPhoneNumber(phoneNumber: string): Promise<UserMaster | null> {
    return prisma.userMaster.findUnique({
      where: { phoneNumber },
    });
  }

  /**
   * Checks for duplicate user by email OR phone number.
   */
  static async findByEmailOrPhone(
    email: string,
    phoneNumber: string
  ): Promise<{ email: string; phoneNumber: string } | null> {
    return prisma.userMaster.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
      select: {
        email: true,
        phoneNumber: true,
      },
    });
  }

  /**
   * Checks if a referral code is already taken.
   */
  static async checkReferralCodeExists(referralCode: string): Promise<boolean> {
    const existing = await prisma.userMaster.findUnique({
      where: { referralCode },
      select: { userId: true },
    });
    return existing !== null;
  }

  /**
   * Checks if a sellerId is already taken.
   */
  static async checkSellerIdExists(sellerId: string): Promise<boolean> {
    const existing = await prisma.userMaster.findUnique({
      where: { sellerId },
      select: { userId: true },
    });
    return existing !== null;
  }

  /**
   * Inserts a new member into the user_masters table.
   */
  static async createMember(data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    referralCode: string;
    referredByCode?: string | null;
    fcmToken?: string | null;
    status?: boolean;
  }): Promise<UserMaster> {
    return prisma.userMaster.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        referralCode: data.referralCode,
        referredByCode: data.referredByCode ?? null,
        fcmToken: data.fcmToken ?? null,
        status: data.status ?? true,
        isHaatzaEmployee: false,
        isSeller: false,
        isNestExpert: false,
        isReseller: false,
        isGSTRegistered: false,
      },
    });
  }

  /**
   * Inserts a new seller into the user_masters table.
   */
  static async createSeller(data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    sellerId: string;
    referralCode: string;
    referredByCode?: string | null;
    fcmToken?: string | null;
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
  }): Promise<UserMaster> {
    return prisma.userMaster.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        sellerId: data.sellerId,
        referralCode: data.referralCode,
        referredByCode: data.referredByCode ?? null,
        fcmToken: data.fcmToken ?? null,
        isSeller: true,
        sellerOnboardedAt: new Date(),
        status: true,
        isHaatzaEmployee: false,
        isNestExpert: false,
        isReseller: false,

        sellerAddress1: data.sellerAddress1 ?? null,
        sellerAddress2: data.sellerAddress2 ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        country: data.country ?? null,
        pinCode: data.pinCode ?? null,
        sellerPickupAddress: data.sellerPickupAddress ?? null,
        pickupLocationId: data.pickupLocationId ?? null,
        latitude: data.latitude !== undefined && data.latitude !== null ? data.latitude : null,
        longitude: data.longitude !== undefined && data.longitude !== null ? data.longitude : null,

        bankName: data.bankName ?? null,
        accountHolderName: data.accountHolderName ?? null,
        accountNumber: data.accountNumber ?? null,
        ifscCode: data.ifscCode ?? null,
        accountManager: data.accountManager ?? null,

        gstin: data.gstin ?? null,
        companyName: data.companyName ?? null,
        panNumber: data.panNumber ?? null,
        isGSTRegistered: data.isGSTRegistered ?? false,
      },
    });
  }

  /**
   * Updates an existing user's employee status.
   */
  static async updateEmployeeRole(
    userId: string,
    isHaatzaEmployee: boolean
  ): Promise<UserMaster> {
    return prisma.userMaster.update({
      where: { userId },
      data: { isHaatzaEmployee },
    });
  }

  /**
   * Updates an existing user's Nest Expert status.
   */
  static async updateNestExpertRole(
    userId: string,
    isNestExpert: boolean
  ): Promise<UserMaster> {
    return prisma.userMaster.update({
      where: { userId },
      data: { isNestExpert },
    });
  }
}

