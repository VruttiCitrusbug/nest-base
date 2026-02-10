/**
 * Configuration Interface
 * 
 * Provides type-safe access to environment variables throughout the application.
 * This ensures we don't have typos when accessing config values.
 */

export interface DatabaseConfig {
  type: 'postgres' | 'mysql' | 'sqlite';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface JwtConfig {
  secret: string;
  expirationTime: string;
  refreshSecret: string;
  refreshExpirationTime: string;
}

export interface AppConfig {
  name: string;
  port: number;
  env: string;
  debug: boolean;
}

export interface CorsConfig {
  origin: string[];
}

export interface ThrottleConfig {
  ttl: number;
  limit: number;
}

export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  cors: CorsConfig;
  throttle: ThrottleConfig;
}
