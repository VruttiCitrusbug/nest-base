import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Custom Validation Pipe
 * 
 * This pipe validates incoming request data against DTO classes using class-validator.
 * DTOs (Data Transfer Objects) define the shape and constraints of request data.
 * 
 * Why create a custom pipe when NestJS has a built-in ValidationPipe?
 * - Custom error formatting
 * - More control over validation behavior
 * - Can add custom validation logic
 * - Better error messages for API consumers
 * 
 * How it works:
 * 1. Transform plain JavaScript object to DTO class instance
 * 2. Run class-validator decorators (@IsString, @IsEmail, etc.)
 * 3. If validation fails, throw BadRequestException with detailed errors
 * 4. If validation passes, return the transformed and validated object
 * 
 * NestJS vs Express:
 * In Express, you might use express-validator or manually validate in each route.
 * In NestJS:
 * - Validation is declarative using decorators
 * - Automatically runs before route handler
 * - Type-safe with TypeScript classes
 * - Can transform data (e.g., trim strings, convert types)
 * 
 * Example DTO:
 * class CreateUserDto {
 *   @IsString()
 *   @MinLength(3)
 *   name: string;
 * 
 *   @IsEmail()
 *   email: string;
 * }
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // Skip validation if no metatype or if it's a native type
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform plain object to class instance
    const object = plainToInstance(metatype, value);

    // Validate the object
    const errors = await validate(object, {
      whitelist: true, // Strip properties without decorators
      forbidNonWhitelisted: true, // Throw error if extra properties exist
      transform: true, // Transform primitive types
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: this.formatErrors(errors),
      });
    }

    return object;
  }

  /**
   * Check if the type should be validated
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Format validation errors into a readable structure
   */
  private formatErrors(errors: ValidationError[]) {
    return errors.map((error) => ({
      field: error.property,
      constraints: error.constraints,
      value: error.value,
    }));
  }
}
