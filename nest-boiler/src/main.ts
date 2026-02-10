import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

/**
 * Bootstrap Function
 * 
 * Initializes and starts the NestJS application.
 * This is where we configure global settings and middleware.
 * 
 * Configuration Order Matters:
 * 1. Security (Helmet, CORS)
 * 2. Parsing (JSON, URL-encoded)
 * 3. Documentation (Swagger)
 * 4. Global pipes, filters (if not using APP_* providers)
 * 5. Start listening
 * 
 * NestJS Application Lifecycle:
 * 1. Create app instance
 * 2. Apply middleware
 * 3. Initialize modules and providers
 * 4. Start HTTP server
 * 5. Ready to accept requests
 */
async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Log levels
  });

  // Get ConfigService for accessing environment variables
const configService = app.get(ConfigService);

  // ===================
  // SECURITY
  // ===================
  
  /**
   * Helmet - Security Headers
   * Adds important HTTP headers to protect against common vulnerabilities:
   * - X-Frame-Options: Prevent clickjacking
   * - X-Content-Type-Options: Prevent MIME sniffing
   * - Strict-Transport-Security: Enforce HTTPS
   * - And more...
   */
  app.use(helmet());

  /**
   * CORS - Cross-Origin Resource Sharing
   * Allows frontend apps from different origins to access this API.
   * 
   * In production, restrict to your actual frontend domains!
   */

  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ===================
  // GLOBAL PREFIX
  // ===================
  
  /**
   * Global API prefix
   * All routes will be prefixed with /api
   * Example: /api/users, /api/auth/login
   * 
   * Benefits:
   * - Versioning: /api/v1/users
   * - Clear separation from static files
   * - Easier reverse proxy configuration
   */
  app.setGlobalPrefix('api', {
    exclude: ['health', 'health/db', 'health/memory'], // Health checks don't need /api prefix
  });

  // Body parsing is handled by NestJS automatically
  // Default limit is 100kb, can be configured in app.module if needed

  // ===================
  // VALIDATION
  // ===================
  
  /**
   * Global Validation Pipe
   * Note: We're also using APP_PIPE provider in AppModule
   * This is backup/explicit configuration
   * 
   * Options:
   * - whitelist: Strip unknown properties
   * - forbidNonWhitelisted: Throw error if unknown properties
   * - transform: Transform payloads to DTO instances
   * - transformOptions.enableImplicitConversion: Auto-convert types
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ===================
  // DOCUMENTATION
  // ===================
  
  /**
   * Set up Swagger documentation
   * Available at: http://localhost:3000/api/docs
   */
  setupSwagger(app);

  // ===================
  // START SERVER
  // ===================
  
  const port = configService.get<number>('app.port') || 3000;
  const env = configService.get<string>('app.env');
  
  await app.listen(port);
  
  console.log('');
  console.log('='.repeat(60));
  console.log(`🚀 NestJS Boilerplate Server`);
  console.log('='.repeat(60));
  console.log(`📝 Environment: ${env}`);
  console.log(`🌐 Server: http://localhost:${port}/api`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
  console.log(`❤️  Health: http://localhost:${port}/health`);
  console.log('='.repeat(60));
  console.log('');
}

// Start the application
bootstrap();
