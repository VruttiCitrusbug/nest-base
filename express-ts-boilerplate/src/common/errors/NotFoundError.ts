import { AppError } from 'common/errors/AppError';

/**
 * Not Found Error
 *
 * Thrown when a requested resource doesn't exist
 * Returns 404 HTTP status code
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
