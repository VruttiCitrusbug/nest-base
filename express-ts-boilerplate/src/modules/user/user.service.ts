import { UserRepository } from 'modules/user/user.repository';
import { CreateUserDto, UpdateUserDto } from 'modules/user/user.dto';
import { User } from 'modules/user/user.model';

import { AppError } from 'common/errors/AppError';

/**
 * User Service
 *
 * Contains business logic for user operations
 * This layer sits between controllers and repositories
 *
 * Responsibilities:
 * - Business rule enforcement
 * - Data transformation
 * - Orchestrating multiple repository calls if needed
 * - Additional validation beyond DTO validation
 */
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Create a new user
   *
   * Business logic:
   * - Check if email already exists
   * - Hash password (TODO: implement actual hashing)
   * - Create user
   */
  async createUser(data: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // TODO: Hash password here using bcrypt
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // data.password = hashedPassword;

    return await this.userRepository.create(data);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<{ users: User[]; total: number; page: number; pageSize: number }> {
    // Validate pagination parameters
    if (page < 1) {
      throw new AppError('Page must be greater than 0', 400);
    }

    if (pageSize < 1 || pageSize > 100) {
      throw new AppError('Page size must be between 1 and 100', 400);
    }

    const { users, total } = await this.userRepository.findAll(page, pageSize, search);

    return {
      users,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Update user
   *
   * Business logic:
   * - Prevent updating email to an existing one
   * - Hash new password if provided
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    // If email is being updated, check for conflicts
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError('Email already in use by another user', 409);
      }
    }

    // TODO: Hash password if it's being updated
    // if (data.password) {
    //   data.password = await bcrypt.hash(data.password, 10);
    // }

    return await this.userRepository.update(id, data);
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
