import { IsString, IsNumber, IsEnum, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Enum for Node environment
 */
export enum NodeEnvironment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

/**
 * Enum for database dialect
 */
export enum DatabaseDialect {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLITE = 'sqlite',
  MARIADB = 'mariadb',
}

/**
 * Environment variables class with validation
 * This ensures all required environment variables are present and correctly typed
 * Similar to Pydantic's Settings management in FastAPI
 */
class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.DEVELOPMENT;

  @IsNumber()
  PORT: number = 3000;

  @IsString()
  APP_NAME: string = 'Express-TS-Boilerplate';

  @IsString()
  DB_HOST: string = 'localhost';

  @IsNumber()
  DB_PORT: number = 5432;

  @IsString()
  DB_NAME: string = 'express_ts_dev';

  @IsString()
  DB_USERNAME: string = 'postgres';

  @IsString()
  DB_PASSWORD: string = '10652';

  @IsEnum(DatabaseDialect)
  DB_DIALECT: DatabaseDialect = DatabaseDialect.POSTGRES;

  @IsString()
  LOG_LEVEL: string = 'debug';

  @IsString()
  JWT_SECRET: string = 'change-this-secret-key-in-production';

  @IsString()
  JWT_EXPIRES_IN: string = '24h';
}

/**
 * Validate environment variables
 * Throws an error if validation fails
 */
function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((error) => {
      return `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`;
    });
    throw new Error(`Configuration validation failed:\n${errorMessages.join('\n')}`);
  }

  return validatedConfig;
}

/**
 * Validated and typed environment configuration
 * Export this to use throughout the application
 */
export const env = validateEnv(process.env);
