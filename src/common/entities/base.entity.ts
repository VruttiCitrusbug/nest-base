import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * Base Entity Class
 * 
 * All database entities should extend this base class to inherit common fields.
 * This ensures consistency across all tables and provides essential auditing capabilities.
 * 
 * Fields:
 * - id: Auto-generated UUID (more secure than auto-increment integers)
 * - createdAt: Automatically set when record is created
 * - updatedAt: Automatically updated when record is modified
 * - deletedAt: For soft deletes (record isn't actually removed from DB)
 * - version: For optimistic locking (prevents concurrent update conflicts)
 * 
 * NestJS vs Express/Sequelize:
 * In Sequelize, you might use hooks and default values.
 * TypeORM uses decorators which are more declarative and type-safe.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  @VersionColumn({
    default: 1,
  })
  version: number;
}
