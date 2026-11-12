import { z } from 'zod';
import { uuidSchema } from '../../common/validations/common.validation';

export const employeeUpdateSchema = z
  .object({
    userId: uuidSchema,
    isHaatzaEmployee: z.boolean(),
  })
  .strict();

export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;

