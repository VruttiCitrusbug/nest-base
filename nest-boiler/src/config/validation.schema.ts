import * as Joi from 'joi';

/**
 * Environment Validation Schema
 * 
 * This Joi schema validates all environment variables when the application starts.
 * If any required variable is missing or invalid, the application will fail to start
 * with a clear error message.
 * 
 * Benefits:
 * - Fail fast: Catch configuration errors at startup, not at runtime
 * - Clear errors: Know exactly which variables are missing or invalid
 * - Type safety: Ensure values are in the correct format (numbers, booleans, etc.)
 */
export const validationSchema = Joi.object({
  // Application
  APP_NAME: Joi.string().default('nestjs-boilerplate'),
  APP_PORT: Joi.number().default(3000),
  APP_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Database
  DB_TYPE: Joi.string().valid('postgres', 'mysql', 'sqlite').default('postgres'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRATION: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // Rate Limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),
});
