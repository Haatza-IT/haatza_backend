import { z } from 'zod';
import { emailSchema } from '../../common/validations/email.validation';
import { phoneSchema } from '../../common/validations/phone.validation';
import { passcodeSchema } from '../../common/validations/common.validation';

export const memberRegistrationSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: emailSchema,
    phoneNumber: phoneSchema,
    passcode: passcodeSchema,
    status: z.boolean().optional().default(true),
    referral: z.string().trim().optional(),
    referralCode: z.string().trim().optional(),
    fcmToken: z.string().trim().optional().nullable(),
  })
  .strict();

export type MemberRegistrationInput = z.infer<typeof memberRegistrationSchema>;
