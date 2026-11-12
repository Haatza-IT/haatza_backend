import { Injectable, ConflictException, Inject } from '@nestjs/common';
import crypto from 'crypto';
import { UserMasterRepository } from '../../database/user-master.repository';
import { hashPassword } from '../../common/utils/password.util';
import type { SellerRegistrationDto, SellerResponse, SanitizedSeller } from './sellers.types';
import { SELLER_MESSAGES } from './sellers.types';

@Injectable()
export class SellersService {
  private readonly MAX_RETRIES = 10;

  constructor(
    @Inject(UserMasterRepository)
    private readonly userRepository: UserMasterRepository,
  ) {}

  /**
   * Generates a unique referral code starting with 'HZ'.
   */
  async generateUniqueReferralCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let i = 0; i < this.MAX_RETRIES; i++) {
      let code = 'HZ';
      const bytes = crypto.randomBytes(6);
      for (let j = 0; j < 6; j++) {
        code += chars[bytes[j] % chars.length];
      }
      const existing = await this.userRepository.checkReferralCodeExists(code);
      if (!existing) {
        return code;
      }
    }
    return `HZ${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  }

  /**
   * Generates a unique seller ID starting with 'HSL-'.
   * Owned exclusively by Seller business logic.
   */
  async generateUniqueSellerId(): Promise<string> {
    for (let i = 0; i < this.MAX_RETRIES; i++) {
      const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
      const candidate = `HSL-${hex}`;
      const existing = await this.userRepository.checkSellerIdExists(candidate);
      if (!existing) {
        return candidate;
      }
    }
    return `HSL-${Date.now().toString(36).toUpperCase()}`;
  }

  /**
   * Masks a bank account number, preserving only the last 4 digits.
   * Example: '50100123456789' -> 'XXXXXXXXXX6789'
   */
  private maskAccountNumber(accountNumber?: string | null): string | null {
    if (!accountNumber) return null;
    const trimmed = accountNumber.trim();
    if (trimmed.length <= 4) {
      return 'X'.repeat(trimmed.length);
    }
    return 'X'.repeat(trimmed.length - 4) + trimmed.slice(-4);
  }

  /**
   * Sanitizes seller response: strips password and masks bank account number.
   */
  private sanitizeSeller(user: any): SanitizedSeller {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeData } = user;
    return {
      ...safeData,
      accountNumber: this.maskAccountNumber(safeData.accountNumber),
    } as SanitizedSeller;
  }

  /**
   * Registers a Haatza Seller with full profile, tax, and banking details.
   */
  async registerSeller(dto: SellerRegistrationDto): Promise<SellerResponse> {
    // 1. Conflict detection for email or phone
    const existing = await this.userRepository.findByEmailOrPhone(dto.email, dto.phoneNumber);
    if (existing) {
      if (existing.email === dto.email) {
        throw new ConflictException({
          success: false,
          message: SELLER_MESSAGES.EMAIL_ALREADY_EXISTS,
          errors: [{ field: 'email', message: SELLER_MESSAGES.EMAIL_ALREADY_EXISTS }],
        });
      }
      if (existing.phoneNumber === dto.phoneNumber) {
        throw new ConflictException({
          success: false,
          message: SELLER_MESSAGES.PHONE_ALREADY_EXISTS,
          errors: [{ field: 'phoneNumber', message: SELLER_MESSAGES.PHONE_ALREADY_EXISTS }],
        });
      }
    }

    // 2. Hash passcode with bcrypt (12 rounds)
    const hashedPassword = await hashPassword(dto.passcode);

    // 3. Generate unique sellerId and referralCode
    const sellerId = await this.generateUniqueSellerId();
    const referralCode = await this.generateUniqueReferralCode();

    // 4. Persist to database
    const createdSeller = await this.userRepository.createSeller({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
      referralCode,
      referredByCode: dto.referral && dto.referral.trim().length > 0 ? dto.referral.trim() : null,
      fcmToken: dto.fcmToken ?? null,
      sellerId,
      sellerAddress1: dto.sellerAddress1 ?? null,
      sellerAddress2: dto.sellerAddress2 ?? null,
      city: dto.city ?? null,
      state: dto.state ?? null,
      country: dto.country ?? null,
      pinCode: dto.pinCode ?? null,
      sellerPickupAddress: dto.sellerPickupAddress ?? null,
      pickupLocationId: dto.pickupLocationId ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      bankName: dto.bankName ?? null,
      accountHolderName: dto.accountHolderName ?? null,
      accountNumber: dto.accountNumber ?? null,
      ifscCode: dto.ifscCode ?? null,
      accountManager: dto.accountManager ?? null,
      gstin: dto.gstin ?? null,
      companyName: dto.companyName ?? null,
      panNumber: dto.panNumber ?? null,
      isGSTRegistered: dto.isGSTRegistered ?? false,
    });

    // 5. Return sanitized response
    return {
      success: true,
      message: SELLER_MESSAGES.REGISTERED_SUCCESS,
      data: this.sanitizeSeller(createdSeller),
    };
  }
}
