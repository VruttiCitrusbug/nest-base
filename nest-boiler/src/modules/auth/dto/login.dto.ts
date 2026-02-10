import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Login DTO
 * 
 * Defines the structure for login requests.
 * Simple email + password authentication.
 */
export class LoginDto {
  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecureP@ss123',
    description: 'User password'
  })
  @IsString()
  @MinLength(6)
  password: string;
}
