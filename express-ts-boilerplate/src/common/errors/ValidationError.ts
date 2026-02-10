import { AppError } from 'common/errors/AppError';
import { ValidationError as ClassValidatorError } from 'class-validator';

/**
 * Validation Error
 *
 * Thrown when request validation fails (similar to Pydantic ValidationError in FastAPI)
 * Contains detailed information about which fields failed validation
 */
export interface ValidationErrorDetail {
  field: string;
  constraints: string[];
  value?: any;
}

export class ValidationError extends AppError {
  public readonly errors: ValidationErrorDetail[];

  constructor(message: string = 'Validation failed', errors: ValidationErrorDetail[] = []) {
    super(message, 400);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Create ValidationError from class-validator errors
   */
  static fromClassValidator(errors: ClassValidatorError[]): ValidationError {
    const validationErrors: ValidationErrorDetail[] = errors.map((error) => ({
      field: error.property,
      constraints: error.constraints ? Object.values(error.constraints) : [],
      value: error.value,
    }));

    return new ValidationError('Validation failed', validationErrors);
  }
}
