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
  generateReferralCodeCandidate(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'HZ';
    const bytes = crypto.randomBytes(6);
    for (let j = 0; j < 6; j++) {
      code += chars[bytes[j] % chars.length];
    }
    return code;
  }

  /**
   * Generates a unique seller ID starting with 'HSL-'.
   * Uses 8 hexadecimal random characters (over 4.29 billion unique possibilities).
   */
  generateSellerIdCandidate(): string {
    const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `HSL-${hex}`;
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
    // 1. High-Performance Parallelization:
    // Run duplicate email/phone check (Network) and bcrypt hashing (CPU) simultaneously.
    const [existing, hashedPassword] = await Promise.all([
      this.userRepository.findByEmailOrPhone(dto.email, dto.phoneNumber),
      hashPassword(dto.passcode),
    ]);

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

    // 2. Generate unique sellerId and referralCode candidates in memory without extra network round-trips
    const sellerId = this.generateSellerIdCandidate();
    const referralCode = this.generateReferralCodeCandidate();

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
