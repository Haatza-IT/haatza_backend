import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * NestJS Guard that secures administrative endpoints.
 * Supports:
 * - `x-admin-key: <key>` header
 * - `Authorization: Bearer <key>` header
 *
 * Security:
 * - Reads expected key from `ADMIN_API_KEY` in environment.
 * - ZERO hardcoded fallback secrets: fails closed if ADMIN_API_KEY is not defined.
 * - Missing key: 401 Unauthorized.
 * - Invalid key: 403 Forbidden.
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
    if (!suppliedKey) {
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

    // 3. Key Mismatch Check (403 Forbidden)
    if (suppliedKey !== expectedSecret) {
      throw new ForbiddenException({
        success: false,
        message: 'Forbidden: Insufficient permissions',
        errors: [],
      });
    }

    return true;
  }
}

