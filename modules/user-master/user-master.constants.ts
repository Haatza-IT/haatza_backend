/**
 * User Master Constants
 */

export const USER_MASTER_CONSTANTS = {
  REFERRAL_CODE_PREFIX: "HZ",
  SELLER_ID_PREFIX: "HSL-",
  MAX_ID_GENERATION_RETRIES: 10,
  DEFAULT_STATUS: true,
  DEFAULT_IS_EMPLOYEE: false,
  DEFAULT_IS_SELLER: false,
  DEFAULT_IS_NEST_EXPERT: false,
  DEFAULT_IS_RESELLER: false,
  DEFAULT_IS_GST_REGISTERED: false,
} as const;

export const USER_MASTER_MESSAGES = {
  MEMBER_REGISTERED_SUCCESS: "Haatza member registered successfully",
  SELLER_REGISTERED_SUCCESS: "Haatza seller registered successfully",
  EMPLOYEE_UPDATED_SUCCESS: "Haatza employee status updated successfully",
  NEST_EXPERT_UPDATED_SUCCESS: "Haatza Nest Expert status updated successfully",
  USER_NOT_FOUND: "User not found with the specified userId",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  PHONE_ALREADY_EXISTS: "Phone number already exists",
  VALIDATION_FAILED: "Validation failed",
  INVALID_JSON: "Invalid JSON body",
} as const;

