import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

/**
 * Database Module
 * 
 * This module configures TypeORM integration with NestJS.
 * It uses the ConfigService to get database settings from environment variables.
 * 
 * Dynamic Module Pattern:
 * TypeOrmModule.forRootAsync() creates a dynamic module that waits for ConfigModule
 * to be ready before configuring the database connection.
 * 
 * Why async configuration?
 * - Environment variables might not be loaded yet
 * - Allows dependency injection (ConfigService)
 * - More flexible and testable
 * 
 * TypeORM vs Sequelize:
 * - Both are ORMs but with different philosophies
 * - TypeORM: More TypeScript-native, uses decorators heavily
 * - Sequelize: More traditional, similar to ActiveRecord pattern
 * - TypeORM migrations: TypeScript-based, type-safe
 * - Sequelize migrations: JavaScript-based, queryInterface
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        
        // Connection pool settings for production
        extra: {
          max: 20, // Maximum connections in pool
          min: 5,  // Minimum connections in pool
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
