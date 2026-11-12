import { z } from 'zod';
import { emailSchema } from '../../common/validations/email.validation';
import { phoneSchema } from '../../common/validations/phone.validation';
import {
  pinCodeSchema,
  passcodeSchema,
  latitudeSchema,
  longitudeSchema,
} from '../../common/validations/common.validation';
import {
  accountNumberSchema,
  ifscSchema,
} from '../../common/validations/banking.validation';
import {
  panSchema,
  gstinSchema,
} from '../../common/validations/tax.validation';

export const sellerRegistrationSchema = z
  .object({
    // User Details
    name: z.string().trim().min(1, 'Name is required'),
    email: emailSchema,
    phoneNumber: phoneSchema,
    passcode: passcodeSchema,
    fcmToken: z.string().trim().optional().nullable(),
    referral: z.string().trim().optional(),

    // Seller Details
    sellerAddress1: z.string().trim().optional().nullable(),
    sellerAddress2: z.string().trim().optional().nullable(),
    city: z.string().trim().optional().nullable(),
    state: z.string().trim().optional().nullable(),
    country: z.string().trim().optional().nullable(),
    pinCode: pinCodeSchema.optional().nullable(),
    sellerPickupAddress: z.string().trim().optional().nullable(),
    pickupLocationId: z.string().trim().optional().nullable(),
    latitude: latitudeSchema.optional().nullable(),
    longitude: longitudeSchema.optional().nullable(),

    // Banking Details
    bankName: z.string().trim().optional().nullable(),
    accountHolderName: z.string().trim().optional().nullable(),
    accountNumber: accountNumberSchema.optional().nullable(),
    ifscCode: ifscSchema.optional().nullable(),
    accountManager: z.string().trim().optional().nullable(),

    // Business & Tax Details
    gstin: gstinSchema.optional().nullable(),
    companyName: z.string().trim().optional().nullable(),
    panNumber: panSchema.optional().nullable(),
    isGSTRegistered: z.boolean().optional().default(false),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.isGSTRegistered && !data.gstin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'GSTIN is required when registered under GST',
        path: ['gstin'],
      });
    }
  });

export type SellerRegistrationInput = z.infer<typeof sellerRegistrationSchema>;

