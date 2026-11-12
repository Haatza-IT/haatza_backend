import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { handleDatabaseError } from '../utils/api-error.util';

/**
 * Global NestJS Exception Filter.
 * Formats all exceptions and errors into the exact existing Haatza API error format:
 * {
 *   "success": false,
 *   "message": "...",
 *   "errors": [...]
 * }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. NestJS HttpException (Validation, Guard, NotFound, etc.)
    const isHttpException =
      exception instanceof HttpException ||
      (typeof exception === 'object' &&
        exception !== null &&
        typeof (exception as Record<string, unknown>).getStatus === 'function');

    if (isHttpException) {
      const httpEx = exception as HttpException;
      const status = httpEx.getStatus();
      const exceptionResponse = httpEx.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const respObj = exceptionResponse as Record<string, unknown>;

        // If thrown with our standard structure
        if ('success' in respObj && 'message' in respObj) {
          return response.status(status).json({
            success: respObj.success,
            message: respObj.message,
            errors: Array.isArray(respObj.errors) ? respObj.errors : [],
          });
        }

        let message =
          typeof respObj.message === 'string'
            ? respObj.message
            : Array.isArray(respObj.message)
              ? respObj.message.join(', ')
              : httpEx.message;

        if (status === 413 || (typeof message === 'string' && message.includes('too large'))) {
          message = 'Payload too large: Request body exceeds the 100KB size limit';
        }

        return response.status(status).json({
          success: false,
          message: message || 'An error occurred',
          errors: Array.isArray(respObj.errors) ? respObj.errors : [],
        });
      }

      const rawMsg = typeof exceptionResponse === 'string' ? exceptionResponse : httpEx.message;
      const message =
        status === 413 || (typeof rawMsg === 'string' && rawMsg.includes('too large'))
          ? 'Payload too large: Request body exceeds the 100KB size limit'
          : rawMsg;

      return response.status(status).json({
        success: false,
        message,
        errors: [],
      });
    }

    // 2. Express middleware errors with HTTP status (e.g. body-parser 413 Payload Too Large)
    const errObj = exception as Record<string, unknown> | null;
    const rawStatus =
      errObj && typeof errObj === 'object'
        ? (errObj.status || errObj.statusCode)
        : null;

    if (typeof rawStatus === 'number' && rawStatus >= 400 && rawStatus < 600) {
      const isEntityTooLarge =
        rawStatus === 413 ||
        errObj?.type === 'entity.too.large' ||
        (typeof errObj?.message === 'string' && errObj.message.includes('too large'));

      const message = isEntityTooLarge
        ? 'Payload too large: Request body exceeds the 100KB size limit'
        : typeof errObj?.message === 'string'
          ? errObj.message
          : 'Request error';

      return response.status(rawStatus).json({
        success: false,
        message,
        errors: [],
      });
    }

    // 3. Database or unexpected runtime errors
    const dbErr = handleDatabaseError(exception);
    return response.status(dbErr.status).json({
      success: false,
      message: dbErr.message,
      errors: dbErr.errors,
    });
  }
}
