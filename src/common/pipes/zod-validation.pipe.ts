import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { formatZodErrors } from '../utils/api-response.util';

/**
 * NestJS Validation Pipe that executes Zod schemas on incoming request bodies.
 * Preserves the exact existing error response structure and 400 status code.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodTypeAny) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error);
      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return result.data;
  }
}

