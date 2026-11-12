import { z } from 'zod';
import { uuidSchema } from '../../common/validations/common.validation';

export const nestExpertUpdateSchema = z
  .object({
    userId: uuidSchema,
    isNestExpert: z.boolean(),
  })
  .strict();

export type NestExpertUpdateInput = z.infer<typeof nestExpertUpdateSchema>;

