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

    // Fast single-query lookup with targeted 6-column projection
    const user = await this.userMasterRepo.findUserForCheck(phoneNumber, email);

    const response: CheckUserResponse = !user
      ? {
          success: true,
          message: 'User does not exist. Available for new registration.',
          data: {
            exists: false,
            isRegistered: false,
          },
        }
      : {
          success: true,
          message: 'User exists in system',
          data: {
            exists: true,
            isRegistered: true,
            nickname: this.extractNickname(user.email, user.name),
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            referralCode: user.referralCode,
            status: user.status,
          },
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
        accessToken: session.accessToken,
        tokenType: 'Bearer',
        expiresIn: session.expiresIn,
        refreshTokenExpiresIn: session.refreshTokenExpiresIn,
      },
    };
  }

  // =========================================================================
  // 3. Login with Phone Number (POST /login_phonenumber)
  // =========================================================================
  async loginPhoneNumber(dto: LoginPhoneNumberDto): Promise<OtpSendResponse> {
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

    return this.generateAndSendOtpInternal(dto.phoneNumber, 'login');
  }

  // =========================================================================
  // 4. Generate OTP (POST /generate_otp)
  // =========================================================================
  async generateOtp(dto: GenerateOtpDto): Promise<OtpSendResponse> {
    const purpose = dto.purpose || 'login';
    return this.generateAndSendOtpInternal(dto.phoneNumber, purpose);
  }

  /**
   * Internal helper handling rate limiting, storage, and SMS dispatch.
   */
  private async generateAndSendOtpInternal(
    phoneNumber: string,
    purpose: string,
  ): Promise<OtpSendResponse> {
    // 1. Rate limiting check (cooldown)
    const recentOtp = await this.prisma.otpStorage.findFirst({
      where: {
        phoneNumber,
        purpose,
        createdAt: {
          gte: new Date(Date.now() - this.RESEND_COOLDOWN_SECONDS * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOtp) {
      const waitSeconds = Math.ceil(
        (this.RESEND_COOLDOWN_SECONDS * 1000 - (Date.now() - recentOtp.createdAt.getTime())) / 1000,
      );
      throw new BadRequestException({
        success: false,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
        errors: [],
      });
    }

    // 2. Generate 6-digit OTP
    const otp = this.generateNumericOtp();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + this.OTP_TTL_MINUTES * 60 * 1000);

    // 3. Save in otp_storage
    await this.prisma.otpStorage.create({
      data: {
        phoneNumber,
        otpHash,
        otpCode: otp,
        purpose,
        expiresAt,
        isVerified: false,
        attempts: 0,
      },
    });

    // 4. Send SMS via Fast2SMS
    const smsResult = await this.fast2smsService.sendOtpSms(phoneNumber, otp);

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
      message: 'OTP Sent Successfully',
      data: {
        phoneNumber,
        expiresInSeconds: this.OTP_TTL_MINUTES * 60,
      },
    };
  }

  // =========================================================================
  // 5. Verify OTP (POST /verify_otp)
  // =========================================================================
  async verifyOtp(
    dto: VerifyOtpDto,
    context?: ClientAuditContext,
    res?: Response,
  ): Promise<VerifyOtpResponse> {
    const purpose = dto.purpose || 'login';

    // Stage 1 Parallelization:
    // Fetch latest OTP record and lookup user simultaneously in a single network round-trip
    const [otpRecord, user] = await Promise.all([
      this.prisma.otpStorage.findFirst({
        where: {
          phoneNumber: dto.phoneNumber,
          purpose,
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

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {
      return {
        success: false,
        message: 'OTP expired. Please request a new OTP.',
      };
    }

    // Compare code or SHA-256 hash
    const inputHash = this.hashOtp(dto.otp);
    const isValid = otpRecord.otpCode === dto.otp || otpRecord.otpHash === inputHash;

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

    // Validate account status before creating session
    if (purpose === 'login' && user && !user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'Account is inactive or disabled. Please contact Haatza support.',
        errors: [],
      });
    }

    // Stage 2 Parallelization:
    // Mark OTP as verified and persist auth session token in parallel
    const sessionPromise = (purpose === 'login' && user)
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

    // If purpose is login, deliver tokens
    if (purpose === 'login') {
      if (user && session) {
        this.setRefreshCookie(res, session.refreshToken);

        return {
          success: true,
          message: 'OTP verified successfully',
          data: {
            customer: {
              nickname: this.extractNickname(user.email, user.name),
              status: user.status,
              email: user.email,
              phoneNumber: user.phoneNumber,
              referralCode: user.referralCode,
            },
            accessToken: session.accessToken,
            tokenType: 'Bearer',
            expiresIn: session.expiresIn,
          },
        };
      }

      // If user does not exist in user_masters, OTP verified for new onboarding
      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          customer: undefined,
        },
      };
    }

    // Verification or forgot_password purpose
    return {
      success: true,
      message: 'OTP verified successfully',
      data: {
        customer: user
          ? {
              nickname: this.extractNickname(user.email, user.name),
              status: user.status,
              email: user.email,
              phoneNumber: user.phoneNumber,
              referralCode: user.referralCode,
            }
          : undefined,
      },
    };
  }

  // =========================================================================
  // 6. Resend OTP (POST /resend_otp)
  // =========================================================================
  async resendOtp(dto: ResendOtpDto): Promise<OtpSendResponse> {
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

    const inputHash = this.hashOtp(dto.otp);
    const isValid = otpRecord.otpCode === dto.otp || otpRecord.otpHash === inputHash;

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

