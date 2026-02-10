import { User } from 'modules/user/user.model';
import { CreateUserDto, UpdateUserDto } from 'modules/user/user.dto';

import { NotFoundError } from 'common/errors/NotFoundError';
import { DatabaseError } from 'common/errors/DatabaseError';

import { Op } from 'sequelize';

/**
 * User Repository
 *
 * Handles all database operations for users
 * This layer is responsible for data access only - no business logic
 *
 * Repository Pattern Benefits:
 * - Separates data access from business logic
 * - Makes code testable (can mock repository)
 * - Provides a consistent interface for data operations
 */
export class UserRepository {
  /**
   * Create a new user
   */
  async create(data: CreateUserDto): Promise<User> {
    try {
      const user = await User.create({
        email: data.email,
        password: data.password, // In production, hash this before storing!
        firstName: data.firstName,
        lastName: data.lastName,
      });
      return user;
    } catch (error: any) {
      // Handle unique constraint violation (duplicate email)
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new DatabaseError('Email already exists');
      }
      throw new DatabaseError('Failed to create user', error);
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: { email },
    });
  }

  /**
   * Find all users with pagination and search
   */
  async findAll(
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<{ users: User[]; total: number }> {
    try {
      const offset = (page - 1) * pageSize;

      // Build where clause for search
      const whereClause = search
        ? {
            [Op.or]: [
              { email: { [Op.iLike]: `%${search}%` } },
              { firstName: { [Op.iLike]: `%${search}%` } },
              { lastName: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {};

      const { rows: users, count: total } = await User.findAndCountAll({
        where: whereClause,
        limit: pageSize,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return { users, total };
    } catch (error: any) {
      throw new DatabaseError('Failed to fetch users', error);
    }
  }

  /**
   * Update user by ID
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findById(id);

      await user.update(data);

      return user;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      // Handle unique constraint violation
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new DatabaseError('Email already exists');
      }

      throw new DatabaseError('Failed to update user', error);
    }
  }

  /**
   * Soft delete user by ID
   */
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await user.destroy(); // This performs soft delete due to paranoid: true
  }

  /**
   * Hard delete user (permanent)
   */
  async hardDelete(id: string): Promise<void> {
    const user = await this.findById(id);
    await user.destroy({ force: true });
  }
}
