import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * Create User DTO
 * 
 * Data Transfer Object for creating a new user.
 * DTOs serve multiple purposes:
 * 1. Input validation using class-validator decorators
 * 2. Type safety for API requests
 * 3. API documentation generation for Swagger
 * 4. Clear contract between frontend and backend
 * 
 * Validation Decorators:
 * @IsString(): Must be a string
 * @IsEmail(): Must be valid email format
 * @MinLength(6): Minimum 6 characters
 * @IsEnum(): Must be one of the enum values
 * @IsOptional(): Field is optional
 * 
 * Swagger Decorators:
 * @ApiProperty(): Document required field
 * @ApiPropertyOptional(): Document optional field
 */
export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ 
    example: 'john.doe@example.com', 
    description: 'Email address (must be unique)' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecureP@ss123', 
    description: 'Password (minimum 6 characters)',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ 
    enum: UserRole, 
    default: UserRole.USER,
    description: 'User role for authorization'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
