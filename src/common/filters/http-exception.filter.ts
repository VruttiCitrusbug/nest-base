import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ErrorResponse } from '../interfaces/api-response.interface';

/**
 * Global Exception Filter
 * 
 * This filter catches ALL exceptions thrown in the application and formats them
 * into a consistent error response structure.
 * 
 * Why do we need this?
 * - Consistent error format across the entire API
 * - Hide internal error details from clients (security)
 * - Log all errors for debugging
 * - Handle different types of errors (HTTP, database, validation, etc.)
 * - Support DEBUG mode for developer-friendly error details
 * 
 * NestJS vs Express:
 * In Express, you'd create an error middleware: app.use((err, req, res, next) => {...})
 * In NestJS, exception filters are more powerful:
 * - They can be scoped (global, controller, or method level)
 * - They integrate with NestJS's dependency injection
 * - They're type-safe and can handle specific exception types
 * 
 * DEBUG Mode:
 * - When DEBUG=true: Show all error details (for development)
 * - When DEBUG=false:
 *   - Errors < 500: Show user-friendly validation/client errors
 *   - Errors >= 500: Show only "Something went wrong" message
 */
@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  /**
   * Get user-friendly error message based on status code
   */
  private getUserFriendlyMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'The request data is invalid',
      401: 'You are not authenticated. Please log in to continue',
      403: "You don't have permission to access this resource",
      404: 'The requested resource was not found',
      409: 'This resource already exists',
      422: 'The provided data could not be processed',
      429: 'Too many requests. Please try again later',
    };

    // For client errors (4xx), return specific message or generic
    if (status >= 400 && status < 500) {
      return messages[status] || 'Invalid request';
    }

    // For server errors (5xx), always return generic message
    return 'Something went wrong. Please try again later';
  }

  /**
   * Format validation errors in a user-friendly way
   */
  private formatValidationErrors(errors: any[]): any[] {
    return errors.map((err) => {
      if (typeof err === 'object' && err.constraints) {
        return {
          field: err.property,
          errors: Object.values(err.constraints),
        };
      }
      return err;
    });
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isDebugMode = this.configService.get<boolean>('app.debug', false);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong. Please try again later';
    let errors: any[] | undefined;
    let detailedError: string | undefined;

    // Handle NestJS HTTP Exceptions (most common)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        
        // Handle class-validator errors (array of validation messages)
        if (Array.isArray(responseObj.message)) {
          // This is validation error
          message = this.getUserFriendlyMessage(status);
          errors = this.formatValidationErrors(responseObj.message);
        } else {
          // Use the exception message if it's user-friendly, otherwise use default
          message = responseObj.message || this.getUserFriendlyMessage(status);
          errors = responseObj.errors;
        }
      }
    }
    // Handle TypeORM Database Errors
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = this.getUserFriendlyMessage(status);
      detailedError = (exception as any).detail || exception.message;
      
      // Store full error for logging
      if (isDebugMode) {
        errors = [detailedError];
      }
    }
    // Handle all other errors
    else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = this.getUserFriendlyMessage(status);
      detailedError = exception.message;
      
      // Store stack trace for debug mode
      if (isDebugMode && exception.stack) {
        errors = [exception.stack];
      }
    }

    // Apply DEBUG mode logic
    // For server errors (>= 500), hide details unless DEBUG is true
    if (status >= 500 && !isDebugMode) {
      message = this.getUserFriendlyMessage(status);
      errors = undefined; // Hide all error details
    }

    // For client errors (< 500), show errors in both modes
    // (they are already user-friendly)

    const errorResponse: ErrorResponse = {
      success: false,
      message,
      ...(errors && { errors }),
    };

    // Always log the full error server-side (regardless of DEBUG mode)
    const logContext = {
      method: request.method,
      url: request.url,
      status,
      message,
      detailedError,
      userAgent: request.headers['user-agent'],
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
      JSON.stringify(logContext),
    );

    response.status(status).json(errorResponse);
  }
}
