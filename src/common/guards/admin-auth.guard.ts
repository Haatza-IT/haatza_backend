import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

/**
 * Timing-safe string comparison to protect against timing side-channel attacks.
 * Both strings are hashed using SHA-256 before comparison via crypto.timingSafeEqual,
 * ensuring:
 * 1. Constant 32-byte buffers regardless of input lengths.
 * 2. Constant-time comparison execution.
 * 3. Never throws TypeError from buffer length differences.
 * 4. Zero information leakage about key length or content.
 */
function timingSafeCompare(supplied: string, expected: string): boolean {
  if (typeof supplied !== 'string' || typeof expected !== 'string') {
    return false;
  }
  const hashA = crypto.createHash('sha256').update(supplied).digest();
  const hashB = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * NestJS Guard that secures administrative endpoints.
 * Supports:
 * - `x-admin-key: <key>` header
 * - `Authorization: Bearer <key>` header
 *
 * Security:
 * - Reads expected key from `ADMIN_API_KEY` in environment.
 * - ZERO hardcoded fallback secrets: fails closed if ADMIN_API_KEY is not defined.
 * - Missing credentials: 401 Unauthorized.
 * - Incorrect credentials: 403 Forbidden.
 * - Timing-safe comparison prevents timing attack enumeration.
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminKeyHeader = request.headers['x-admin-key'];
    const authHeader = request.headers['authorization'];

    let suppliedKey: string | null = null;

    if (adminKeyHeader) {
      suppliedKey = Array.isArray(adminKeyHeader)
        ? adminKeyHeader[0].trim()
        : String(adminKeyHeader).trim();
    } else if (authHeader) {
      const authStr = Array.isArray(authHeader) ? authHeader[0].trim() : String(authHeader).trim();
      if (authStr.startsWith('Bearer ')) {
        suppliedKey = authStr.substring(7).trim();
      } else {
        suppliedKey = authStr;
      }
    }

    // 1. Missing Key Check (401 Unauthorized)
    if (!suppliedKey || suppliedKey.length === 0) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authentication required: Admin API key is missing. Provide x-admin-key or Authorization Bearer header.',
        errors: [],
      });
    }

    const expectedSecret = process.env.ADMIN_API_KEY;

    // 2. Secure Configuration Check: fail closed if server has no key configured
    if (!expectedSecret || expectedSecret.trim().length === 0) {
      throw new UnauthorizedException({
        success: false,
        message: 'Authentication failed: Server administrator authentication is not configured.',
        errors: [],
      });
    }

    // 3. Timing-Safe Key Verification (403 Forbidden on mismatch)
    if (!timingSafeCompare(suppliedKey, expectedSecret.trim())) {
      throw new ForbiddenException({
        success: false,
        message: 'Forbidden: Insufficient permissions',
        errors: [],
      });
    }

    return true;
  }
}


