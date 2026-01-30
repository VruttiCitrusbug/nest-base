import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Register DTO
 * 
 * Simplified registration that delegates to CreateUserDto.
 * You could also directly use CreateUserDto, but having a separate
 * RegisterDto allows for different fields/validations if needed.
 */
export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
