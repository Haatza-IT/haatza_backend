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

        const message =
          typeof respObj.message === 'string'
            ? respObj.message
            : Array.isArray(respObj.message)
              ? respObj.message.join(', ')
              : httpEx.message;

        return response.status(status).json({
          success: false,
          message: message || 'An error occurred',
          errors: Array.isArray(respObj.errors) ? respObj.errors : [],
        });
      }

      return response.status(status).json({
        success: false,
        message: typeof exceptionResponse === 'string' ? exceptionResponse : httpEx.message,
        errors: [],
      });
    }

    // 2. Database or unexpected runtime errors
    const dbErr = handleDatabaseError(exception);
    return response.status(dbErr.status).json({
      success: false,
      message: dbErr.message,
      errors: dbErr.errors,
    });
  }
}
