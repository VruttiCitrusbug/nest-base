import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

/**
 * Auth Response DTO
 * 
 * Response structure for successful login/register.
 * Includes JWT access token and user details.
 */
export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'Token type', example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ description: 'Token expiration time', example: '1d' })
  expiresIn: string;

  @ApiProperty({ type: UserResponseDto, description: 'User details' })
  user: UserResponseDto;
}
