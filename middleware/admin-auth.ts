import { apiError } from "@/utils/api-response";

const ADMIN_SECRET = process.env.ADMIN_API_KEY || "haatza_admin_secret_key_2026";

/**
 * Middleware function that verifies administrator authorization for privileged endpoints.
 * Checks for either:
 * - `x-admin-key` header
 * - `Authorization: Bearer <key>` header
 *
 * Returns null if authorized, or a NextResponse with 401 (Unauthorized) / 403 (Forbidden).
 */
export function verifyAdminAuthorization(request: Request) {
  const adminKeyHeader = request.headers.get("x-admin-key");
  const authHeader = request.headers.get("authorization");

  let suppliedKey: string | null = null;

  if (adminKeyHeader) {
    suppliedKey = adminKeyHeader.trim();
  } else if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      suppliedKey = authHeader.substring(7).trim();
    } else {
      suppliedKey = authHeader.trim();
    }
  }

  if (!suppliedKey) {
    return apiError(
      "Authentication required: Admin API key is missing. Provide x-admin-key or Authorization Bearer header.",
      401
    );
  }

  if (suppliedKey !== ADMIN_SECRET) {
    return apiError("Forbidden: Insufficient permissions", 403);
  }

  return null;
}

