import { NextResponse } from "next/server";
import { z } from "zod";

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

/**
 * Returns a standardized JSON success response.
 *
 * @param message - Descriptive success message
 * @param data - Optional payload data
 * @param status - HTTP status code (default: 200)
 */
export function apiSuccess<T>(message: string, data?: T, status = 200) {
  const body: ApiResponsePayload<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
  return NextResponse.json(body, { status });
}

/**
 * Returns a standardized JSON error response.
 *
 * @param message - User-facing error message
 * @param status - HTTP status code (default: 400)
 * @param errors - Optional list of detailed errors
 */
export function apiError(
  message: string,
  status = 400,
  errors: unknown[] = []
) {
  const body: ApiResponsePayload = {
    success: false,
    message,
    errors,
  };
  return NextResponse.json(body, { status });
}

/**
 * Transforms a Zod validation error into a clean array of field/message objects.
 */
export function formatZodErrors(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));
}

