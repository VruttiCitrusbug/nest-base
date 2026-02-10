import { Configuration } from './configuration.interface';

/**
 * Configuration Factory
 * 
 * This function loads and structures environment variables into a type-safe configuration object.
 * It runs when the application starts and validates all required environment variables.
 * 
 * NestJS vs Express: In Express, you might use dotenv directly. In NestJS, the ConfigModule
 * provides dependency injection, validation, and type-safe access to config values.
 */
export default (): Configuration => ({
  app: {
    name: process.env.APP_NAME || 'nestjs-boilerplate',
    port: parseInt(process.env.APP_PORT || '3000', 10),
    env: process.env.APP_ENV || 'development',
    debug: process.env.DEBUG === 'true',
  },
  database: {
    type: (process.env.DB_TYPE as 'postgres' | 'mysql' | 'sqlite') || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'nestjs_boilerplate',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expirationTime: process.env.JWT_EXPIRATION || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
  },
});
