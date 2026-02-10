import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

/**
 * Base Model
 *
 * Abstract class that all models should extend.
 * Provides common fields that every table should have.
 *
 * Similar to CustomBaseModel in your FastAPI project.
 *
 * Fields:
 * - id: Primary key (UUID)
 * - createdAt: Timestamp when record was created
 * - updatedAt: Timestamp when record was last updated
 * - deletedAt: Timestamp when record was soft deleted (null if not deleted)
 */
@Table({
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export abstract class BaseModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt!: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  deletedAt!: Date | null;

  /**
   * Convert model instance to plain object
   * Useful for API responses
   */
  toJSON(): any {
    const values = { ...this.get() };

    // Remove deletedAt from response if null
    if (values.deletedAt === null) {
      delete values.deletedAt;
    }

    return values;
  }
}
