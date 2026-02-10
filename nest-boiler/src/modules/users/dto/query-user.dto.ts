import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * Query User DTO
 * 
 * Used for filtering, sorting, and paginating user lists.
 * Query parameters arrive as strings, so we use @Type() to transform them.
 * 
 * Why a separate DTO for queries?
 * - GET requests use query strings (all values are strings)
 * - Need type transformation (string "10" → number 10)
 * - Different validation rules than create/update
 * - Clear API documentation for filtering options
 * 
 * Pagination pattern:
 * - page: Which page to fetch (1-indexed)
 * - limit: How many items per page
 * - sortBy: Which field to sort by
 * - sortOrder: ASC or DESC
 * - Additional filters: role, search, etc.
 */
export class QueryUserDto {
  @ApiPropertyOptional({ description: 'Page number (1-indexed)', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Sort field', enum: ['createdAt', 'email', 'firstName', 'lastName'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Filter by user role', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;
}
