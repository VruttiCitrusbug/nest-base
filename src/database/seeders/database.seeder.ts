import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Database Seeder Service
 * 
 * Seeds initial data into the database for development/testing.
 * 
 * Usage:
 * Create a custom command or run manually in development.
 * 
 * Best Practices:
 * - Make seeders idempotent (can run multiple times safely)
 * - Check if data exists before inserting
 * - Use transactions for atomic operations
 * - Different seeders for dev/test/production
 * 
 * Why seed data?
 * - Quick development setup
 * - Testing with realistic data
 * - Demo environments
 * - Initial admin user creation
 */
@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Main seed function
   * Orchestrates all individual seeders
   */
  async seed(): Promise<void> {
    this.logger.log('🌱 Starting database seeding...');

    await this.seedUsers();

    this.logger.log('✅ Database seeding completed!');
  }

  /**
   * Seed users
   * Creates admin, manager, and regular users
   */
  private async seedUsers(): Promise<void> {
    this.logger.log('Seeding users...');

    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin@123', 10),
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@example.com',
        password: await bcrypt.hash('Manager@123', 10),
        role: UserRole.MANAGER,
        isActive: true,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('User@123', 10),
        role: UserRole.USER,
        isActive: true,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('User@123', 10),
        role: UserRole.USER,
        isActive: true,
      },
    ];

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        this.logger.log(`  ✓ Created user: ${userData.email}`);
      } else {
        this.logger.log(`  → User already exists: ${userData.email}`);
      }
    }
  }

  /**
   * Clear all data (use with caution!)
   * Useful for testing or resetting development database
   */
  async clear(): Promise<void> {
    this.logger.warn('🗑️  Clearing database...');
    
    await this.userRepository.clear();
    
    this.logger.warn('✅ Database cleared!');
  }
}
