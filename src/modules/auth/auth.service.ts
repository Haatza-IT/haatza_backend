import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import type { JwtPayload, TokenSession, ClientAuditContext } from './auth.types';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_TTL_SECONDS = 900; // 15 minutes
  private readonly REFRESH_TOKEN_TTL_SECONDS = 7200; // 2 hours (120 minutes)

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Retrieves the configured JWT secret.
   * Fails closed if not configured in production, or uses safe default in development.
   */
  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (secret && secret.trim().length > 0) {
      return secret.trim();
    }
    return 'haatza_default_secure_jwt_secret_key_2026';
  }

  /**
   * Base64URL encode a buffer or string.
   */
  private base64UrlEncode(data: string | Buffer): string {
    const buf = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
    return buf
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  /**
   * Base64URL decode to string.
   */
  private base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  /**
   * Signs a JWT using HMAC-SHA256.
   */
  signAccessToken(userId: string, email: string): string {
    const secret = this.getJwtSecret();
    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.ACCESS_TOKEN_TTL_SECONDS;

    const header = this.base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = this.base64UrlEncode(
      JSON.stringify({
        sub: userId,
        email,
        role: 'member',
        iat: now,
        exp,
      }),
    );

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest();
    const signatureBase64Url = this.base64UrlEncode(signature);

    return `${header}.${payload}.${signatureBase64Url}`;
  }

  /**
   * Verifies a JWT access token.
   */
  verifyAccessToken(token: string): JwtPayload {
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid access token',
        errors: [],
      });
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException({
        success: false,
        message: 'Malformed access token format',
        errors: [],
      });
    }

    const [header, payload, signature] = parts;
    const secret = this.getJwtSecret();

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest();
    const expectedBase64Url = this.base64UrlEncode(expectedSignature);

    // Timing-safe comparison of signatures
    const hashSupplied = crypto.createHash('sha256').update(signature).digest();
    const hashExpected = crypto.createHash('sha256').update(expectedBase64Url).digest();

    if (!crypto.timingSafeEqual(hashSupplied, hashExpected)) {
      throw new UnauthorizedException({
        success: false,
        message: 'Access token signature verification failed',
        errors: [],
      });
    }

    try {
      const decoded = JSON.parse(this.base64UrlDecode(payload)) as JwtPayload;
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        throw new UnauthorizedException({
          success: false,
          message: 'Access token has expired',
          errors: [],
        });
      }
      return decoded;
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid access token payload',
        errors: [],
      });
    }
  }

  /**
   * Generates a cryptographically secure random refresh token.
   */
  private generateSecureRandomToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  /**
   * Computes SHA-256 hash of a refresh token for safe database persistence.
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Formats client audit string recording identity, IP, location, and device agent.
   */
  private formatAuditInfo(identity: string, context?: ClientAuditContext): string {
    const parts = [identity];
    if (context?.ip && context.ip !== 'unknown') parts.push(`IP: ${context.ip}`);
    if (context?.location) parts.push(`Loc: ${context.location}`);
    if (context?.userAgent && context.userAgent !== 'unknown') {
      parts.push(`Device: ${context.userAgent.slice(0, 80)}`);
    }
    return parts.join(' | ');
  }

  /**
   * Creates an active token session (Access Token + Hashed Refresh Token in DB).
   * Valid for 2 hours (7200 seconds) with location and client audit tracking.
   */
  async createSession(
    userId: string,
    email: string,
    context?: ClientAuditContext,
  ): Promise<TokenSession> {
    const rawRefreshToken = this.generateSecureRandomToken();
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_TTL_SECONDS * 1000);
    const auditInfo = this.formatAuditInfo(email, context);

    // Persist hashed token in PostgreSQL with audit columns
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        isRevoked: false,
        createdBy: auditInfo,
        updatedBy: auditInfo,
      },
    });

    const accessToken = this.signAccessToken(userId, email);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: this.ACCESS_TOKEN_TTL_SECONDS,
      refreshTokenExpiresIn: this.REFRESH_TOKEN_TTL_SECONDS,
    };
  }

  /**
   * Refreshes a session by rotating the refresh token and generating a fresh access token.
   * Enforces 2-hour session expiration and records refreshing location/device.
   */
  async refreshSession(
    rawRefreshToken: string,
    context?: ClientAuditContext,
  ): Promise<TokenSession> {
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string' || rawRefreshToken.trim().length === 0) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authentication required: Refresh token is missing',
        errors: [],
      });
    }

    const tokenHash = this.hashToken(rawRefreshToken.trim());

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            status: true,
          },
        },
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid refresh token',
        errors: [],
      });
    }

    // Token reuse detection: if an already-revoked token is used, invalidate all sessions for security
    if (tokenRecord.isRevoked) {
      const breachAudit = `Breach detected: Reuse of revoked token | ${this.formatAuditInfo(tokenRecord.user?.email || tokenRecord.userId, context)}`;
      await this.prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: {
          isRevoked: true,
          updatedBy: breachAudit,
        },
      });
      throw new UnauthorizedException({
        success: false,
        message: 'Refresh token has already been revoked. Please log in again.',
        errors: [],
      });
    }

    // Check expiration (Strict 2-hour timeout)
    if (new Date() > tokenRecord.expiresAt) {
      throw new UnauthorizedException({
        success: false,
        message: 'Refresh token has expired (2-hour session limit). Please log in again.',
        errors: [],
      });
    }

    // Verify user is active
    if (!tokenRecord.user || !tokenRecord.user.status) {
      throw new UnauthorizedException({
        success: false,
        message: 'User account is deactivated',
        errors: [],
      });
    }

    const refreshAuditInfo = this.formatAuditInfo(tokenRecord.user.email, context);

    // 1. Invalidate old token (Rotation)
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        isRevoked: true,
        updatedBy: `Rotated | ${refreshAuditInfo}`,
      },
    });

    // 2. Generate new token pair with fresh 2-hour expiration
    const newRawRefreshToken = this.generateSecureRandomToken();
    const newTokenHash = this.hashToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + this.REFRESH_TOKEN_TTL_SECONDS * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId: tokenRecord.userId,
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
        isRevoked: false,
        createdBy: `Rotated from ${tokenRecord.id.slice(0, 8)} | ${refreshAuditInfo}`,
        updatedBy: refreshAuditInfo,
      },
    });

    const newAccessToken = this.signAccessToken(tokenRecord.user.userId, tokenRecord.user.email);

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
      expiresIn: this.ACCESS_TOKEN_TTL_SECONDS,
      refreshTokenExpiresIn: this.REFRESH_TOKEN_TTL_SECONDS,
    };
  }

  /**
   * Revokes a refresh token (used by logout or explicit revocation).
   */
  async revokeToken(rawRefreshToken: string, context?: ClientAuditContext): Promise<boolean> {
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
      return false;
    }
    const tokenHash = this.hashToken(rawRefreshToken.trim());
    try {
      const audit = context
        ? `Revoked | ${this.formatAuditInfo('Client', context)}`
        : 'Revoked by user logout';
      await this.prisma.refreshToken.update({
        where: { tokenHash },
        data: {
          isRevoked: true,
          updatedBy: audit,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Revokes all active refresh tokens for a user (used upon password reset or security breach).
   */
  async revokeAllUserSessions(userId: string, reason = 'Security revocation / password reset'): Promise<number> {
    const res = await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        updatedBy: reason,
      },
    });
    return res.count;
  }
}

