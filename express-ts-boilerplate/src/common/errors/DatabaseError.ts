import { AppError } from 'common/errors/AppError';

/**
 * Database Error
 *
 * Thrown when database operations fail
 * Wraps Sequelize errors with consistent formatting
 */
export class DatabaseError extends AppError {
  public readonly originalError?: Error;

  constructor(message: string = 'Database operation failed', originalError?: Error) {
    super(message, 500);
    this.originalError = originalError;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
