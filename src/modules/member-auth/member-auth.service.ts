import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Inject,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import type { Response } from 'express';
import { PrismaService } from '../../database/prisma.service';
import { UserMasterRepository } from '../../database/user-master.repository';
import { AuthService } from '../auth/auth.service';
import { Fast2SmsService } from './fast2sms.service';
import { hashPassword, verifyPassword } from '../../common/utils/password.util';
import type { ClientAuditContext } from '../auth/auth.types';
import type {
  CheckUserQueryDto,
  LoginEmailDto,
  LoginPhoneNumberDto,
  GenerateOtpDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './member-auth.schema';
import type {
  CheckUserResponse,
  LoginResponse,
  LoginPhoneNumberResponse,
  OtpSendResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
} from './member-auth.types';

@Injectable()
export class MemberAuthService {
  private readonly logger = new Logger(MemberAuthService.name);
  private readonly OTP_TTL_MINUTES = 5;
  private readonly RESEND_COOLDOWN_SECONDS = 30;
  private readonly MAX_VERIFY_ATTEMPTS = 5;
  private readonly checkUserCache = new Map<string, { data: CheckUserResponse; expiresAt: number }>();
  private readonly CHECK_CACHE_TTL_MS = 60000; // 60s cache for ultra-fast checkUser responses
  private readonly activeLocks = new Map<string, Promise<void>>();

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(UserMasterRepository)
    private readonly userMasterRepo: UserMasterRepository,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(Fast2SmsService)
    private readonly fast2smsService: Fast2SmsService,
  ) {}

  /**
   * Concurrency mutex ensuring atomic execution per phone number & purpose.
   */
  private async runWithLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    while (this.activeLocks.has(key)) {
      await this.activeLocks.get(key);
    }
    let resolveLock!: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      resolveLock = resolve;
    });
    this.activeLocks.set(key, lockPromise);

    try {
      return await fn();
    } finally {
      this.activeLocks.delete(key);
      resolveLock();
    }
  }

  /**
   * Securely derives a 32-byte key for AES-256-GCM authenticated encryption.
   */
  private getEncryptionKey(): Buffer {
    const rawKey =
      process.env.OTP_ENCRYPTION_KEY ||
      process.env.JWT_SECRET ||
      'haatza_secure_otp_default_encryption_key_2026';
    return crypto.createHash('sha256').update(rawKey).digest();
  }

  /**
   * Encrypts a 6-digit OTP using AES-256-GCM (authenticated encryption).
   * Generates a 12-byte random IV and 16-byte authentication tag.
   * Format: `${ivHex}:${authTagHex}:${cipherHex}` (70 chars).
   */
  private encryptOtp(otp: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.getEncryptionKey(), iv);
    let encrypted = cipher.update(otp, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypts an AES-256-GCM encrypted OTP payload.
   * Verifies the authTag; returns null if tampered or invalid.
   */
  private decryptOtp(payload: string): string | null {
    try {
      const parts = payload.split(':');
      if (parts.length !== 3) return null;
      const [ivHex, authTagHex, cipherHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.getEncryptionKey(), iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      this.logger.error(`Failed to decrypt OTP: ${(err as Error).message}`);
      return null;
    }
  }

  /**
   * Constant-time verification of OTP SHA-256 hash to prevent timing attacks.
   */
  private verifyOtpHash(inputOtp: string, storedHash: string): boolean {
    const inputHash = this.hashOtp(inputOtp);
    if (inputHash.length !== storedHash.length) return false;
    return crypto.timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(storedHash, 'hex'));
  }

  /**
   * Generates a cryptographically strong 6-digit numeric OTP.
   */
  private generateNumericOtp(): string {
    const num = crypto.randomInt(100000, 1000000);
    return num.toString();
  }

  /**
   * Hashes an OTP code with SHA-256 for tamper-proof storage.
   */
  private hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Extracts a nickname from an email or user name.
   */
  private extractNickname(email?: string | null, name?: string | null): string {
    if (email && email.includes('@')) {
      return email.split('@')[0];
    }
    if (name && name.trim().length > 0) {
      return name.trim();
    }
    return 'Customer';
  }

  /**
   * Sets the 2-hour HTTP-only refresh token cookie on Express response if available.
   */
  private setRefreshCookie(res: Response | undefined, refreshToken: string): void {
    if (!res || typeof res.cookie !== 'function') return;
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7200 * 1000, // 2 hours in ms
      path: '/',
    });
  }

  // =========================================================================
  // 1. Check User (GET /check_user)
  // =========================================================================
  async checkUser(query: CheckUserQueryDto): Promise<CheckUserResponse> {
    const { phoneNumber, email } = query;

    if (!phoneNumber && !email) {
      throw new BadRequestException({
        success: false,
        message: 'At least one identifier (phoneNumber or email) is required to check user existence',
        errors: [],
      });
    }

    const cacheKey = phoneNumber ? `p:${phoneNumber}` : `e:${email}`;
    const cached = this.checkUserCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // Fast single-query lookup with targeted primary key projection
    const user = await this.userMasterRepo.findUserForCheck(phoneNumber, email);

    const response: CheckUserResponse = !user
      ? {
          success: false,
          message: 'User does not exist in system',
        }
      : {
          success: true,
          message: 'User exists in system',
        };

    if (this.checkUserCache.size > 1000) {
      const firstKey = this.checkUserCache.keys().next().value;
      if (firstKey) this.checkUserCache.delete(firstKey);
    }
    this.checkUserCache.set(cacheKey, { data: response, expiresAt: Date.now() + this.CHECK_CACHE_TTL_MS });

    return response;
  }

  // =========================================================================
  // 2. Login with Email (POST /login_email)
  // =========================================================================
  async loginEmail(
    dto: LoginEmailDto,
    context?: ClientAuditContext,
    res?: Response,
  ): Promise<LoginResponse> {
    // Fast targeted auth projection (userId, name, email, phoneNumber, password, status, referralCode)
    const user = await this.userMasterRepo.findUserForAuth(dto.email, null);

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid email or password',
        errors: [],
      });
    }

    if (!user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account is inactive or disabled. Please contact Haatza support.',
        errors: [],
      });
    }

    const isMatch = await verifyPassword(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid email or password',
        errors: [],
      });
    }

    const session = await this.authService.createSession(user.userId, user.email, context);
    this.setRefreshCookie(res, session.refreshToken);
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('x-access-token', session.accessToken);
      res.setHeader('Authorization', `Bearer ${session.accessToken}`);
    }

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          referralCode: user.referralCode,
          status: user.status,
        },
      },
    };
  }

  // =========================================================================
  // 3. Login with Phone Number (POST /login_phonenumber)
  // =========================================================================
  async loginPhoneNumber(dto: LoginPhoneNumberDto): Promise<LoginPhoneNumberResponse> {
    const user = await this.userMasterRepo.findUserForAuth(null, dto.phoneNumber);

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'No registered user found with this phone number. Please register first.',
        errors: [],
      });
    }

    if (!user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account is inactive or disabled. Please contact Haatza support.',
        errors: [],
      });
    }

    // Step 1: Member check only. Does NOT generate or send OTP. Does NOT call Fast2SMS.
    return {
      success: true,
      message: 'Phone number verified. Proceed with OTP generation.',
    };
  }

  // =========================================================================
  // 4. Generate OTP (POST /generate_otp)
  // =========================================================================
  async generateOtp(dto: GenerateOtpDto): Promise<OtpSendResponse> {
    // Step 2: Validate that member exists before generating OTP
    const user = await this.userMasterRepo.findUserForAuth(null, dto.phoneNumber);

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'No registered user found with this phone number. Please register first.',
        errors: [],
      });
    }

    if (!user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account is inactive or disabled. Please contact Haatza support.',
        errors: [],
      });
    }

    const purpose = dto.purpose || 'login';
    return this.generateAndSendOtpInternal(dto.phoneNumber, purpose);
  }

  /**
   * Internal helper handling rate limiting, storage, and SMS dispatch.
   * Enforces 5-minute backend OTP validity, authenticated AES-256-GCM encryption,
   * same-OTP reuse, and concurrency protection.
   */
  private async generateAndSendOtpInternal(
    phoneNumber: string,
    purpose: string,
  ): Promise<OtpSendResponse> {
    const lockKey = `${phoneNumber}:${purpose}`;

    return this.runWithLock(lockKey, async () => {
      const now = new Date();

      // 1. Check for an active, unverified, unexpired OTP for this phone number and purpose
      const activeOtp = await this.prisma.otpStorage.findFirst({
        where: {
          phoneNumber,
          purpose,
          isVerified: false,
          expiresAt: {
            gt: now, // Still valid within the 5-minute backend window
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (activeOtp) {
        // Cooldown check: prevent immediate repeated spam clicks
        const lastActionTime = activeOtp.updatedAt || activeOtp.createdAt;
        const elapsedMs = Date.now() - lastActionTime.getTime();

        if (elapsedMs < this.RESEND_COOLDOWN_SECONDS * 1000) {
          const waitSeconds = Math.ceil(
            (this.RESEND_COOLDOWN_SECONDS * 1000 - elapsedMs) / 1000,
          );
          throw new BadRequestException({
            success: false,
            message: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
            errors: [],
          });
        }

        // Resend the SAME active OTP without generating a new one
        // Recover original OTP via authenticated decryption
        let otpToSend: string | null = null;
        if (activeOtp.otpCode) {
          otpToSend = this.decryptOtp(activeOtp.otpCode);
          if (!otpToSend && /^\d{6}$/.test(activeOtp.otpCode)) {
            // Support legacy plaintext records if present
            otpToSend = activeOtp.otpCode;
          }
        }

        if (!otpToSend) {
          // Safeguard: if encrypted payload is somehow unreadable, generate fresh OTP
          otpToSend = this.generateNumericOtp();
          await this.prisma.otpStorage.update({
            where: { id: activeOtp.id },
            data: {
              otpHash: this.hashOtp(otpToSend),
              otpCode: this.encryptOtp(otpToSend),
              updatedAt: new Date(),
            },
          });
        } else {
          // Update updatedAt to reset the 30-second resend cooldown timer.
          // IMPORTANT: Do NOT change createdAt, and do NOT extend expiresAt!
          await this.prisma.otpStorage.update({
            where: { id: activeOtp.id },
            data: {
              updatedAt: new Date(),
            },
          });
        }

        // Dispatch the same recovered OTP via Fast2SMS
        const smsResult = await this.fast2smsService.sendOtpSms(phoneNumber, otpToSend);

        if (!smsResult.success) {
          this.logger.warn(`Fast2SMS failed for ${phoneNumber}: ${smsResult.message}`);
          return {
            success: false,
            message: smsResult.message || 'Failed to dispatch SMS',
            error: smsResult.detail,
          };
        }

        return {
          success: true,
          message: 'OTP sent successfully.',
        };
      }

      // 2. No active valid OTP exists (either never requested or previous OTP expired > 5 mins ago)
      // Cooldown check for any very recently created OTP
      const recentAnyOtp = await this.prisma.otpStorage.findFirst({
        where: {
          phoneNumber,
          purpose,
          createdAt: {
            gte: new Date(Date.now() - this.RESEND_COOLDOWN_SECONDS * 1000),
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (recentAnyOtp) {
        const waitSeconds = Math.ceil(
          (this.RESEND_COOLDOWN_SECONDS * 1000 - (Date.now() - recentAnyOtp.createdAt.getTime())) / 1000,
        );
        if (waitSeconds > 0) {
          throw new BadRequestException({
            success: false,
            message: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
            errors: [],
          });
        }
      }

      // Generate a new 6-digit secure numeric OTP
      const newOtp = this.generateNumericOtp();
      const otpHash = this.hashOtp(newOtp);
      const encryptedOtp = this.encryptOtp(newOtp);
      const expiresAt = new Date(Date.now() + this.OTP_TTL_MINUTES * 60 * 1000); // Exactly 5 minutes (300s)

      // Store in otp_storage: verification hash in otp_hash, encrypted OTP in otp_code.
      // Plaintext OTP is NEVER persisted in the database!
      await this.prisma.otpStorage.create({
        data: {
          phoneNumber,
          otpHash,
          otpCode: encryptedOtp,
          purpose,
          expiresAt,
          isVerified: false,
          attempts: 0,
        },
      });

      // Dispatch new OTP via Fast2SMS
      const smsResult = await this.fast2smsService.sendOtpSms(phoneNumber, newOtp);

      if (!smsResult.success) {
        this.logger.warn(`Fast2SMS failed for ${phoneNumber}: ${smsResult.message}`);
        return {
          success: false,
          message: smsResult.message || 'Failed to dispatch SMS',
          error: smsResult.detail,
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully.',
      };
    });
  }

  // =========================================================================
  // 5. Verify OTP (POST /verify_otp)
  // =========================================================================
  async verifyOtp(
    dto: VerifyOtpDto,
    context?: ClientAuditContext,
    res?: Response,
  ): Promise<VerifyOtpResponse> {
    // Stage 1 Parallelization:
    // Fetch latest OTP record and lookup user simultaneously in a single network round-trip
    const [otpRecord, user] = await Promise.all([
      this.prisma.otpStorage.findFirst({
        where: {
          phoneNumber: dto.phoneNumber,
          ...(dto.purpose ? { purpose: dto.purpose } : {}),
          isVerified: false,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.userMasterRepo.findUserForAuth(null, dto.phoneNumber),
    ]);

    if (!otpRecord) {
      return {
        success: false,
        message: 'Phone number not found or no active OTP request',
      };
    }

    // Check maximum verification attempts
    if (otpRecord.attempts >= this.MAX_VERIFY_ATTEMPTS) {
      return {
        success: false,
        message: 'Maximum OTP verification attempts exceeded. Please request a new OTP.',
      };
    }

    // Check expiration using backend server time (5 minutes validity)
    if (new Date() > otpRecord.expiresAt) {
      return {
        success: false,
        message: 'OTP expired. Please request a new OTP.',
      };
    }

    // Constant-time hash verification against stored SHA-256 hash
    let isValid = this.verifyOtpHash(dto.otp, otpRecord.otpHash);
    if (!isValid && otpRecord.otpCode) {
      const decrypted = this.decryptOtp(otpRecord.otpCode);
      if (decrypted && decrypted === dto.otp) {
        isValid = true;
      } else if (otpRecord.otpCode === dto.otp) {
        isValid = true;
      }
    }

    if (!isValid) {
      // Increment attempt counter
      await this.prisma.otpStorage.update({
        where: { id: otpRecord.id },
        data: {
          attempts: { increment: 1 },
        },
      });

      return {
        success: false,
        message: 'Invalid OTP',
      };
    }

    const effectivePurpose = dto.purpose || otpRecord.purpose || 'login';

    // Validate account status before creating session
    if (effectivePurpose === 'login' && user && !user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account is inactive or disabled. Please contact Haatza support.',
        errors: [],
      });
    }

    // Stage 2 Parallelization:
    // Mark OTP as verified and persist auth session token in parallel
    const sessionPromise = user
      ? this.authService.createSession(user.userId, user.email, context)
      : Promise.resolve(null);

    const [, session] = await Promise.all([
      this.prisma.otpStorage.update({
        where: { id: otpRecord.id },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
        },
      }),
      sessionPromise,
    ]);

    if (user && session) {
      this.setRefreshCookie(res, session.refreshToken);
      if (res && typeof res.setHeader === 'function') {
        res.setHeader('x-access-token', session.accessToken);
        res.setHeader('Authorization', `Bearer ${session.accessToken}`);
      }

      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          user: {
            userId: user.userId,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            referralCode: user.referralCode,
            status: user.status,
          },
        },
      };
    }

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  // =========================================================================
  // 6. Resend OTP (POST /resend_otp)
  // =========================================================================
  async resendOtp(dto: ResendOtpDto): Promise<OtpSendResponse> {
    const user = await this.userMasterRepo.findUserForAuth(null, dto.phoneNumber);

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'No registered user found with this phone number. Please register first.',
        errors: [],
      });
    }

    if (!user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account is inactive or disabled. Please contact Haatza support.',
        errors: [],
      });
    }

    const purpose = dto.purpose || 'login';
    return this.generateAndSendOtpInternal(dto.phoneNumber, purpose);
  }

  // =========================================================================
  // 7. Forgot Password (POST /forgot_password)
  // =========================================================================
  async forgotPassword(dto: ForgotPasswordDto): Promise<OtpSendResponse> {
    let user = null;
    if (dto.phoneNumber) {
      user = await this.userMasterRepo.findByPhoneNumber(dto.phoneNumber);
    }
    if (!user && dto.email) {
      user = await this.userMasterRepo.findByEmail(dto.email);
    }

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'No registered user found with the provided details.',
        errors: [],
      });
    }

    if (!user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account is inactive or disabled. Please contact Haatza support.',
        errors: [],
      });
    }

    return this.generateAndSendOtpInternal(user.phoneNumber, 'forgot_password');
  }

  // =========================================================================
  // 8. Reset Password (POST /reset_password)
  // =========================================================================
  async resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    // 1. Verify OTP
    const otpRecord = await this.prisma.otpStorage.findFirst({
      where: {
        phoneNumber: dto.phoneNumber,
        purpose: 'forgot_password',
        isVerified: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException({
        success: false,
        message: 'No password reset OTP request found for this phone number.',
        errors: [],
      });
    }

    if (otpRecord.attempts >= this.MAX_VERIFY_ATTEMPTS) {
      throw new BadRequestException({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new password reset OTP.',
        errors: [],
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException({
        success: false,
        message: 'Password reset OTP has expired. Please request a new OTP.',
        errors: [],
      });
    }

    let isValid = this.verifyOtpHash(dto.otp, otpRecord.otpHash);
    if (!isValid && otpRecord.otpCode) {
      const decrypted = this.decryptOtp(otpRecord.otpCode);
      if (decrypted && decrypted === dto.otp) {
        isValid = true;
      } else if (otpRecord.otpCode === dto.otp) {
        isValid = true;
      }
    }

    if (!isValid) {
      await this.prisma.otpStorage.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException({
        success: false,
        message: 'Invalid OTP code provided',
        errors: [],
      });
    }

    // 2. Find user
    const user = await this.userMasterRepo.findByPhoneNumber(dto.phoneNumber);
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User account not found',
        errors: [],
      });
    }

    // 3. Hash new password with bcrypt 12 salt rounds
    const hashedPassword = await hashPassword(dto.newPassword);

    // 4. Update password in user_masters
    await this.userMasterRepo.updatePassword(user.userId, hashedPassword, 'Password reset via OTP');

    // 5. Invalidate OTP record
    await this.prisma.otpStorage.update({
      where: { id: otpRecord.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    // 6. Revoke all active sessions / refresh tokens
    await this.authService.revokeAllUserSessions(user.userId, 'Password reset by user');

    this.logger.log(`Password reset successfully for user ${user.userId} (${dto.phoneNumber})`);

    return {
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    };
  }
}

