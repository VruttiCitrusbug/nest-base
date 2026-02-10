import { Request, Response, NextFunction } from 'express';

import { AppError } from 'common/errors/AppError';
import { ValidationError } from 'common/errors/ValidationError';
import { errorResponse } from 'common/utils/response';

import logger from 'config/logger';
import { env } from 'config/env';

/**
 * Global Error Handler Middleware
 *
 * This middleware catches ALL errors thrown in the application
 * and formats them into a consistent error response.
 *
 * Similar to FastAPI's exception handlers, this ensures:
 * 1. Consistent error response format
 * 2. Proper logging of errors
 * 3. Different behavior for development vs production
 * 4. Security (doesn't leak sensitive info in production)
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: any = undefined;

  // If it's one of our custom errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    // Handle ValidationError specifically
    if (err instanceof ValidationError) {
      code = 'VALIDATION_ERROR';
      details = err.errors;
    }
  }

  // Log error details
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  // In development, include stack trace
  if (env.NODE_ENV === 'development') {
    if (details && Array.isArray(details)) {
      // If details is already an array (ValidationError), keep it
      details = {
        errors: details,
        stack: err.stack,
        originalError: err.message,
      };
    } else {
      details = {
        ...details,
        stack: err.stack,
        originalError: err.message,
      };
    }
  }

  // Send error response
  return errorResponse(res, message, statusCode, code, details);
};

/**
 * Unhandled Rejection Handler
 *
 * Catches unhandled promise rejections
 */
export const handleUnhandledRejection = (reason: Error): void => {
  logger.error('Unhandled Rejection:', reason);
  throw reason; // Let the uncaught exception handler deal with it
};

/**
 * Uncaught Exception Handler
 *
 * Catches uncaught exceptions and shuts down gracefully
 */
export const handleUncaughtException = (error: Error): void => {
  logger.error('Uncaught Exception:', error);
  process.exit(1); // Exit with failure
};
