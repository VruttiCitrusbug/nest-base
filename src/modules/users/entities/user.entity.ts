import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Exclude } from 'class-transformer';

/**
 * User Entity
 * 
 * Represents the users table in the database.
 * Extends BaseEntity to inherit id, timestamps, and soft delete functionality.
 * 
 * Decorators explained:
 * @Entity(): Marks this class as a database entity
 * @Column(): Defines a table column with constraints
 * @Exclude(): Prevents field from being exposed in API responses (security)
 * 
 * Role enum:
 * Defines possible user roles for authorization.
 * Could be moved to a separate file if roles become complex.
 * 
 * Password hashing:
 * Notice we store hashed password, never plain text.
 * The @Exclude decorator ensures it's never sent in API responses.
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ select: false }) // Don't fetch password by default
  @Exclude() // Don't expose in API responses
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  // Virtual field for full name (not stored in DB)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
