import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Update User DTO
 * 
 * Extends CreateUserDto but makes all fields optional using PartialType.
 * This is a common pattern for update operations where you only send
 * the fields you want to change.
 * 
 * PartialType utility:
 * - Makes all properties optional
 * - Maintains validation decorators
 * - Inherits Swagger documentation
 * - Keeps type safety
 * 
 * NestJS provides similar utilities:
 * - PartialType: Makes all fields optional
 * - PickType: Picks specific fields
 * - OmitType: Omits specific fields
 * - IntersectionType: Combines multiple DTOs
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'Whether user account is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
