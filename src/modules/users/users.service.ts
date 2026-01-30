import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationMeta } from '../../common/interfaces/api-response.interface';

/**
 * Users Service
 * 
 * Contains business logic for user operations.
 * Services should be thin controllers and fat services - most logic here.
 * 
 * Dependency Injection in NestJS:
 * @Injectable(): Marks class as a provider that can be injected
 * @InjectRepository(): Injects TypeORM repository
 * 
 * Repository Pattern:
 * Instead of using User.find() directly, we inject Repository<User>
 * Benefits:
 * - Testable (can mock repository)
 * - Follows NestJS patterns
 * - Type-safe database operations
 * 
 * Service Responsibilities:
 * - Business logic
 * - Data validation (beyond DTO validation)
 * - Database operations
 * - Error handling (throw appropriate HTTP exceptions)
 * - Transaction management
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   * Password is hashed before saving to database
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password (10 salt rounds)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user entity
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Save to database
    return await this.usersRepository.save(user);
  }

  /**
   * Find all users with pagination, filtering, and sorting
   * Returns both data and pagination metadata
   */
  async findAll(queryDto: QueryUserDto): Promise<{ data: User[]; pagination: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', role, search } = queryDto;

    // Build query
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Apply role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Apply search filter (search in firstName, lastName, email)
    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query with count
    const [data, total] = await queryBuilder.getManyAndCount();

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { data, pagination };
  }

  /**
   * Find single user by ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email (used for authentication)
   * Includes password field for validation
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password') // Include password field
      .getOne();
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If updating email, check for conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  /**
   * Soft delete user
   * Using soft delete preserves data for auditing
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softRemove(user);
  }

  /**
   * Update last login timestamp
   * Called after successful authentication
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }
}
