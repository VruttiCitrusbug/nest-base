import { Request, Response, NextFunction } from 'express';
import {
  validate as validateObject,
  ValidationError as ClassValidatorError,
} from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationError } from 'common/errors/ValidationError';

/**
 * Validation Source Enum
 * Defines where to look for data to validate
 */
export enum ValidationSource {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
}

/**
 * Validation Middleware Factory
 *
 * Creates a middleware that validates request data against a DTO class
 * using class-validator decorators (similar to Pydantic in FastAPI)
 *
 * Usage:
 * router.post('/users', validate(CreateUserDto), userController.create)
 *
 * @param dtoClass - The DTO class with validation decorators
 * @param source - Where to get the data from (body, query, params)
 * @param skipMissingProperties - Whether to skip validation of missing properties
 */
export const validate = (
  dtoClass: any,
  source: ValidationSource = ValidationSource.BODY,
  skipMissingProperties: boolean = false
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get data from the specified source
      const dataToValidate = req[source];

      // Transform plain object to class instance
      const dtoInstance = plainToClass(dtoClass, dataToValidate);

      // Validate the DTO instance
      const errors: ClassValidatorError[] = await validateObject(dtoInstance, {
        skipMissingProperties,
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      });

      // If validation fails, throw ValidationError
      if (errors.length > 0) {
        throw ValidationError.fromClassValidator(errors);
      }

      // Replace request data with validated and transformed DTO
      req[source] = dtoInstance;

      next();
    } catch (error) {
      // Log the actual error for debugging
      console.error('Validation middleware error:', error);
      next(error);
    }
  };
};
