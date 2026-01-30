import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';

/**
 * App Module - Root Module
 * 
 * This is the entry point of the NestJS application structure.
 * It imports all feature modules and configures global providers.
 * 
 * Global Providers (APP_*):
 * Using APP_* tokens applies functionality globally without manual registration.
 * - APP_FILTER: Global exception filter
 * - APP_INTERCEPTOR: Global interceptor
 * - APP_PIPE: Global validation pipe
 * - APP_GUARD: Global authentication guard
 * 
 * Module Organization:
 * 1. Configuration (Config, Database)
 * 2. Feature Modules (Users, Auth, Health)
 * 3. Global Providers (Filters, Interceptors, Pipes, Guards)
 * 
 * Why global providers?
 * - Consistent behavior across all routes
 * - No need to add decorators to every controller
 * - Single source of truth for cross-cutting concerns
 * 
 * NestJS vs Express:
 * Express: app.use() adds middleware globally
 * NestJS: Use APP_* providers for global behavior
 * - More type-safe
 * - Better dependency injection
 * - Clearer separation of concerns
 */
@Module({
  imports: [
    // Configuration Module - Must be first!
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
      load: [configuration], // Load our configuration factory
      validationSchema, // Validate env variables on startup
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),

    // Rate Limiting Module
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time window in milliseconds (1 minute)
      limit: 10, // Max requests per TTL
    }]),

    // Database Module
    DatabaseModule,

    // Feature Modules
    UsersModule,
    AuthModule,
    HealthModule,
  ],
  providers: [
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global Response Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    // Global Validation Pipe
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // Global JWT Authentication Guard
    // All routes require authentication unless marked with @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Rate Limiting Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configure Middleware
   * 
   * Middleware runs before guards.
   * Use for request logging, parsing, etc.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
