import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import type { UserMaster } from '../generated/prisma/client';

/**
 * UserMasterRepository
 * Injectable data access layer handling all Prisma database queries for user_masters.
 */
@Injectable()
export class UserMasterRepository {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Finds a user by their unique userId (UUID).
   */
  async findById(userId: string): Promise<UserMaster | null> {
    return this.prisma.userMaster.findUnique({
      where: { userId },
    });
  }

  /**
   * Finds a user by their unique email address.
   */
  async findByEmail(email: string): Promise<UserMaster | null> {
    return this.prisma.userMaster.findUnique({
      where: { email },
    });
  }

  /**
   * Finds a user by their unique phone number.
   */
  async findByPhoneNumber(phoneNumber: string): Promise<UserMaster | null> {
    return this.prisma.userMaster.findUnique({
      where: { phoneNumber },
    });
  }

  /**
   * Finds a user for authentication by email or phone with targeted projection.
   */
  async findUserForAuth(email?: string | null, phoneNumber?: string | null) {
    const conditions = [];
    if (email) conditions.push({ email });
    if (phoneNumber) conditions.push({ phoneNumber });
    if (conditions.length === 0) return null;

    return this.prisma.userMaster.findFirst({
      where: conditions.length === 1 ? conditions[0] : { OR: conditions },
      select: {
        userId: true,
        name: true,
        email: true,
        phoneNumber: true,
        password: true,
        referralCode: true,
        status: true,
      },
    });
  }

  /**
   * Checks user existence by email or phone in a single query with minimal projection.
   */
  async findUserForCheck(phoneNumber?: string | null, email?: string | null) {
    const conditions = [];
    if (phoneNumber) conditions.push({ phoneNumber });
    if (email) conditions.push({ email });
    if (conditions.length === 0) return null;

    return this.prisma.userMaster.findFirst({
      where: conditions.length === 1 ? conditions[0] : { OR: conditions },
      select: {
        userId: true,
      },
    });
  }

  /**
   * Checks for duplicate user by email OR phone number.
   */
  async findByEmailOrPhone(
    email: string,
    phoneNumber: string
  ): Promise<{ email: string; phoneNumber: string } | null> {
    return this.prisma.userMaster.findFirst({
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
  async checkReferralCodeExists(referralCode: string): Promise<boolean> {
    const existing = await this.prisma.userMaster.findUnique({
      where: { referralCode },
      select: { userId: true },
    });
    return existing !== null;
  }

  /**
   * Checks if a sellerId is already taken.
   */
  async checkSellerIdExists(sellerId: string): Promise<boolean> {
    const existing = await this.prisma.userMaster.findUnique({
      where: { sellerId },
      select: { userId: true },
    });
    return existing !== null;
  }

  /**
   * Inserts a new member into the user_masters table.
   */
  async createMember(data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    referralCode: string;
    referredByCode?: string | null;
    fcmToken?: string | null;
    status?: boolean;
    createdBy?: string | null;
    updatedBy?: string | null;
  }): Promise<UserMaster> {
    return this.prisma.userMaster.create({
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
        createdBy: data.createdBy ?? null,
        updatedBy: data.updatedBy ?? null,
      },
    });
  }

  /**
   * Inserts a new seller with profile, banking, and tax details into user_masters.
   */
  async createSeller(data: {
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
    return this.prisma.userMaster.create({
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
   * Updates an existing user's employee status (isHaatzaEmployee).
   */
  async updateEmployeeRole(
    userId: string,
    isHaatzaEmployee: boolean,
    updatedBy?: string | null,
  ): Promise<UserMaster> {
    return this.prisma.userMaster.update({
      where: { userId },
      data: {
        isHaatzaEmployee,
        ...(updatedBy ? { updatedBy } : {}),
      },
    });
  }

  /**
   * Updates an existing user's Nest Expert status (isNestExpert).
   */
  async updateNestExpertRole(
    userId: string,
    isNestExpert: boolean,
    updatedBy?: string | null,
  ): Promise<UserMaster> {
    return this.prisma.userMaster.update({
      where: { userId },
      data: {
        isNestExpert,
        ...(updatedBy ? { updatedBy } : {}),
      },
    });
  }

  /**
   * Updates an existing user's password and optionally updatedBy timestamp.
   */
  async updatePassword(
    userId: string,
    hashedPassword: string,
    updatedBy?: string | null,
  ): Promise<UserMaster> {
    return this.prisma.userMaster.update({
      where: { userId },
      data: {
        password: hashedPassword,
        ...(updatedBy ? { updatedBy } : {}),
      },
    });
  }
}

