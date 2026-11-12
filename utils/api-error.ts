export interface DatabaseErrorResult {
  status: number;
  message: string;
  errors: Array<{ field: string; message: string }>;
}

/**
 * Handles Prisma database errors, transforming known constraint violations
 * (such as P2002 unique constraint) into appropriate HTTP status codes and messages.
 */
export function handleDatabaseError(error: unknown): DatabaseErrorResult {
  if (typeof error === "object" && error !== null && "code" in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] | string } };
    if (prismaError.code === "P2002") {
      const target = Array.isArray(prismaError.meta?.target)
        ? prismaError.meta?.target.join(", ")
        : String(prismaError.meta?.target || "field");

      let message = "A record with this unique value already exists";
      let field = target;

      if (target.includes("email")) {
        message = "Email already exists";
        field = "email";
      } else if (target.includes("phoneNumber")) {
        message = "Phone number already exists";
        field = "phoneNumber";
      } else if (target.includes("sellerId")) {
        message = "Seller ID already exists";
        field = "sellerId";
      } else if (target.includes("referralCode")) {
        message = "Referral code conflict";
        field = "referralCode";
      }

      return {
        status: 409,
        message,
        errors: [{ field, message }],
      };
    }
  }

  // Log unexpected errors on server console for diagnosis
  console.error("Database/Service Error:", error);

  return {
    status: 500,
    message: "An unexpected error occurred while processing your request",
    errors: [],
  };
}

