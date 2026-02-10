/**
 * Base Application Error
 *
 * All custom errors extend this class to ensure consistent error handling.
 * This is similar to creating custom exception classes in FastAPI.
 *
 * Properties:
 * - statusCode: HTTP status code for the error
 * - message: Error message
 * - isOperational: Whether this is a known/expected error
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
