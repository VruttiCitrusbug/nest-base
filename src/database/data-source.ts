import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({
  path: join(__dirname, '../../.env.development'),
});

/**
 * TypeORM Configuration for Migrations
 * 
 * This file is used by TypeORM CLI for running migrations.
 * It's separate from the NestJS TypeORM module configuration.
 * 
 * Why separate configuration?
 * - CLI needs Node.js compatible exports
 * - Development/production might need different settings
 * - Migrations should run independently of the app
 */
export const dataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE as 'postgres') || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'nestjs_boilerplate',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false, // NEVER true in production!
  logging: process.env.DB_LOGGING === 'true',
  migrationsRun: false, // Don't automatically run migrations
};

// Export DataSource instance for CLI
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
