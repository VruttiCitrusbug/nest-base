import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from 'database/models/BaseModel';

/**
 * User Model
 *
 * Represents the users table in the database
 * Extends BaseModel to inherit common fields (id, createdAt, updatedAt, deletedAt)
 *
 * This demonstrates how to create models using sequelize-typescript decorators
 */
@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive!: boolean;

  @Column({
    type: DataType.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  })
  role!: 'admin' | 'user';

  /**
   * Custom JSON method to exclude password from API responses
   */
  toJSON(): any {
    const values = super.toJSON();
    delete values.password; // Never send password in response
    return values;
  }
}
