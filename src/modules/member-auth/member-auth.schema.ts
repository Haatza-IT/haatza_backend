import { z } from 'zod';
import { phoneSchema, normalizeAndValidatePhone } from '../../common/validations/phone.validation';
import { emailSchema } from '../../common/validations/email.validation';
import { passcodeSchema } from '../../common/validations/common.validation';

export const checkUserQuerySchema = z.object({
  phoneNumber: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  identifier: z.string().trim().optional(),
}).transform((data) => {
  const rawPhone = data.phoneNumber || data.phone || (data.identifier && /^\+?\d[\d\s\-()]{7,15}$/.test(data.identifier) ? data.identifier : undefined);
  const rawEmail = data.email || (data.identifier && data.identifier.includes('@') ? data.identifier : undefined);

  return {
    phoneNumber: rawPhone ? normalizeAndValidatePhone(rawPhone) : null,
    email: rawEmail ? rawEmail.toLowerCase().trim() : null,
  };
});

export type CheckUserQueryDto = z.infer<typeof checkUserQuerySchema>;

export const loginEmailSchema = z.object({
  email: emailSchema,
  password: passcodeSchema,
});

export type LoginEmailDto = z.infer<typeof loginEmailSchema>;

export const loginPhoneNumberSchema = z.object({
  phoneNumber: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  password: passcodeSchema.optional(),
  passcode: passcodeSchema.optional(),
}).refine((data) => !!(data.phoneNumber || data.phone), {
  message: 'phoneNumber is required',
}).transform((data) => {
  const raw = data.phoneNumber || data.phone || '';
  const cleaned = normalizeAndValidatePhone(raw);
  if (!cleaned) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Invalid phone number. Must be a valid 10-digit Indian phone number starting with 6-9.',
      },
    ]);
  }
  return {
    phoneNumber: cleaned,
    password: data.password || data.passcode,
  };
});

export type LoginPhoneNumberDto = z.infer<typeof loginPhoneNumberSchema>;

export const generateOtpSchema = z.object({
  phoneNumber: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  purpose: z.enum(['login', 'forgot_password', 'verification']).optional().default('login'),
}).refine((data) => !!(data.phoneNumber || data.phone), {
  message: 'phoneNumber is required',
}).transform((data) => {
  const raw = data.phoneNumber || data.phone || '';
  const cleaned = normalizeAndValidatePhone(raw);
  if (!cleaned) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Invalid phone number. Must be a valid 10-digit Indian phone number starting with 6-9.',
      },
    ]);
  }
  return { phoneNumber: cleaned, purpose: data.purpose };
});

export type GenerateOtpDto = z.infer<typeof generateOtpSchema>;

export const verifyOtpSchema = z.object({
  phoneNumber: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  otp: z.string().trim().regex(/^\d{6}$/, { message: 'OTP must be exactly 6 numeric digits' }),
  purpose: z.enum(['login', 'forgot_password', 'verification']).optional().default('login'),
}).refine((data) => !!(data.phoneNumber || data.phone), {
  message: 'phoneNumber is required',
}).transform((data) => {
  const raw = data.phoneNumber || data.phone || '';
  const cleaned = normalizeAndValidatePhone(raw);
  if (!cleaned) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Invalid phone number. Must be a valid 10-digit Indian phone number starting with 6-9.',
      },
    ]);
  }
  return { phoneNumber: cleaned, otp: data.otp, purpose: data.purpose };
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  phoneNumber: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  purpose: z.enum(['login', 'forgot_password', 'verification']).optional().default('login'),
}).refine((data) => !!(data.phoneNumber || data.phone), {
  message: 'phoneNumber is required',
}).transform((data) => {
  const raw = data.phoneNumber || data.phone || '';
  const cleaned = normalizeAndValidatePhone(raw);
  if (!cleaned) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Invalid phone number. Must be a valid 10-digit Indian phone number starting with 6-9.',
      },
    ]);
  }
  return { phoneNumber: cleaned, purpose: data.purpose };
});

export type ResendOtpDto = z.infer<typeof resendOtpSchema>;

export const forgotPasswordSchema = z.object({
  phoneNumber: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  identifier: z.string().trim().optional(),
}).refine((data) => !!(data.phoneNumber || data.phone || data.email || data.identifier), {
  message: 'Either phoneNumber or email is required',
}).transform((data) => {
  const rawPhone = data.phoneNumber || data.phone || (data.identifier && /^\+?\d[\d\s\-()]{7,15}$/.test(data.identifier) ? data.identifier : undefined);
  const rawEmail = data.email || (data.identifier && data.identifier.includes('@') ? data.identifier : undefined);

  return {
    phoneNumber: rawPhone ? normalizeAndValidatePhone(rawPhone) : null,
    email: rawEmail ? rawEmail.toLowerCase().trim() : null,
  };
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  phoneNumber: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  otp: z.string().trim().regex(/^\d{6}$/, { message: 'OTP must be exactly 6 numeric digits' }),
  newPassword: passcodeSchema,
}).refine((data) => !!(data.phoneNumber || data.phone), {
  message: 'phoneNumber is required',
}).transform((data) => {
  const raw = data.phoneNumber || data.phone || '';
  const cleaned = normalizeAndValidatePhone(raw);
  if (!cleaned) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Invalid phone number. Must be a valid 10-digit Indian phone number starting with 6-9.',
      },
    ]);
  }
  return {
    phoneNumber: cleaned,
    otp: data.otp,
    newPassword: data.newPassword,
  };
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

