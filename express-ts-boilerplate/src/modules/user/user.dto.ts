import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

/**
 * Create User DTO
 *
 * Defines the structure and validation rules for creating a user
 * Similar to Pydantic models in FastAPI
 *
 * Decorators from class-validator provide automatic validation:
 * - @IsEmail: Validates email format
 * - @IsString: Validates string type
 * - @MinLength/@MaxLength: String length validation
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName!: string;

  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName!: string;
}

/**
 * Update User DTO
 *
 * All fields are optional for partial updates
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(100, { message: 'Password cannot exceed 100 characters' })
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * User Response DTO
 *
 * Defines the structure of user data in API responses
 * Uses class-transformer to control which fields are exposed
 */
@Exclude()
export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  // Password is excluded by default (not exposed)
}

/**
 * Query Parameters DTO for listing users
 */
export class UserQueryDto {
  @IsOptional()
  @IsString()
  page?: string = '1';

  @IsOptional()
  @IsString()
  pageSize?: string = '10';

  @IsOptional()
  @IsString()
  search?: string;
}
