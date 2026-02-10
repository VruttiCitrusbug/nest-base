import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

/**
 * Users Module
 * 
 * NestJS modules organize related functionality.
 * Each feature should have its own module.
 * 
 * Module Metadata:
 * - imports: Other modules this module depends on
 * - controllers: HTTP route handlers
 * - providers: Services, repositories, etc. (injectable dependencies)
 * - exports: What to make available to other modules
 * 
 * TypeOrmModule.forFeature():
 * Registers entities for dependency injection.
 * Makes Repository<User> available to inject in services.
 * 
 * exports: [UsersService]
 * Makes UsersService available to other modules (like AuthModule).
 * Without this, other modules can't inject UsersService.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register User entity
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export for use in other modules
})
export class UsersModule {}
