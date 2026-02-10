import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * User Response DTO
 * 
 * Defines which User fields to expose in API responses.
 * This is important for security - never expose sensitive data like passwords.
 * 
 * @Exclude(): Remove all fields by default
 * @Expose(): Only include specifically marked fields
 * 
 * Benefits:
 * - Security: Explicitly control what data is sent to clients
 * - Consistency: Same response format across all endpoints
 * - Documentation: Clear API contract
 * - Flexibility: Can have different response DTOs for different contexts
 * 
 * Usage:
 * In controller, transform entity to DTO:
 * return plainToInstance(UserResponseDto, user);
 * 
 * Or use interceptor for automatic transformation.
 */
@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  lastLoginAt: Date;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  // Note: password, deletedAt, version are excluded
}
