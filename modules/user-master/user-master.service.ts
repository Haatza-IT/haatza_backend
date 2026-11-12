import crypto from "crypto";
import { hashPassword } from "@/lib/password";
import {
  generateRandomReferralCode,
  generateRandomSellerId,
} from "@/utils/generate-referral-code";
import { UserMasterRepository } from "./user-master.repository";
import { sanitizeUserResponse } from "./user-master.utils";
import { USER_MASTER_CONSTANTS } from "./user-master.constants";
import type {
  MemberRegistrationDto,
  SellerRegistrationDto,
  EmployeeUpdateDto,
  NestExpertUpdateDto,
  SanitizedUser,
} from "./user-master.types";

export class UserMasterService {
  /**
   * Generates a collision-safe unique referral code.
   */
  static async getUniqueReferralCode(): Promise<string> {
    for (let i = 0; i < USER_MASTER_CONSTANTS.MAX_ID_GENERATION_RETRIES; i++) {
      const candidate = generateRandomReferralCode();
      const exists = await UserMasterRepository.checkReferralCodeExists(candidate);
      if (!exists) {
        return candidate;
      }
    }
    // High-concurrency fallback with timestamp
    return `HZ${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
  }

  /**
   * Generates a collision-safe unique seller ID.
   */
  static async getUniqueSellerId(): Promise<string> {
    for (let i = 0; i < USER_MASTER_CONSTANTS.MAX_ID_GENERATION_RETRIES; i++) {
      const candidate = generateRandomSellerId();
      const exists = await UserMasterRepository.checkSellerIdExists(candidate);
      if (!exists) {
        return candidate;
      }
    }
    return `HSL-${Date.now().toString(36).toUpperCase()}`;
  }

  /**
   * Registers a normal Haatza Member.
   */
  static async registerMember(dto: MemberRegistrationDto): Promise<{
    user?: SanitizedUser;
    conflict?: { field: string; message: string };
  }> {
    // 1. Pre-check email or phone conflicts
    const existing = await UserMasterRepository.findByEmailOrPhone(
      dto.email,
      dto.phoneNumber
    );

    if (existing) {
      if (existing.email === dto.email) {
        return { conflict: { field: "email", message: "Email already exists" } };
      }
      if (existing.phoneNumber === dto.phoneNumber) {
        return {
          conflict: { field: "phoneNumber", message: "Phone number already exists" },
        };
      }
    }

    // 2. Hash password with bcrypt (12 rounds)
    const hashedPassword = await hashPassword(dto.passcode);

    // 3. Generate unique referral code
    const referralCode = await this.getUniqueReferralCode();

    // 4. Create user in database through repository
    const newUser = await UserMasterRepository.createMember({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
      referralCode,
      referredByCode: dto.referral || null,
      fcmToken: dto.fcmToken ?? null,
      status: dto.status ?? true,
    });

    return { user: sanitizeUserResponse(newUser) };
  }

  /**
   * Registers a Haatza Seller with full profile, tax, and banking details.
   */
  static async registerSeller(dto: SellerRegistrationDto): Promise<{
    seller?: SanitizedUser;
    conflict?: { field: string; message: string };
  }> {
    // 1. Pre-check email or phone conflicts
    const existing = await UserMasterRepository.findByEmailOrPhone(
      dto.email,
      dto.phoneNumber
    );

    if (existing) {
      if (existing.email === dto.email) {
        return { conflict: { field: "email", message: "Email already exists" } };
      }
      if (existing.phoneNumber === dto.phoneNumber) {
        return {
          conflict: { field: "phoneNumber", message: "Phone number already exists" },
        };
      }
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(dto.passcode);

    // 3. Generate unique sellerId and referralCode
    const [sellerId, referralCode] = await Promise.all([
      this.getUniqueSellerId(),
      this.getUniqueReferralCode(),
    ]);

    // 4. Create seller in database through repository
    const newSeller = await UserMasterRepository.createSeller({
      ...dto,
      password: hashedPassword,
      sellerId,
      referralCode,
      referredByCode: dto.referral || null,
    });

    return { seller: sanitizeUserResponse(newSeller) };
  }

  /**
   * Updates employee status for an existing user.
   */
  static async updateEmployeeStatus(dto: EmployeeUpdateDto): Promise<{
    user?: SanitizedUser;
    notFound?: boolean;
  }> {
    const existing = await UserMasterRepository.findById(dto.userId);
    if (!existing) {
      return { notFound: true };
    }

    const updated = await UserMasterRepository.updateEmployeeRole(
      dto.userId,
      dto.isHaatzaEmployee
    );

    return { user: sanitizeUserResponse(updated) };
  }

  /**
   * Updates Nest Expert status for an existing user.
   */
  static async updateNestExpertStatus(dto: NestExpertUpdateDto): Promise<{
    user?: SanitizedUser;
    notFound?: boolean;
  }> {
    const existing = await UserMasterRepository.findById(dto.userId);
    if (!existing) {
      return { notFound: true };
    }

    const updated = await UserMasterRepository.updateNestExpertRole(
      dto.userId,
      dto.isNestExpert
    );

    return { user: sanitizeUserResponse(updated) };
  }
}

