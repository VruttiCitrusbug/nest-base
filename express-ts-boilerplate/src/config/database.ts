import { Sequelize } from 'sequelize-typescript';
import { env } from 'config/env';
import logger from 'config/logger';

/**
 * Sequelize instance configuration
 *
 * This is the main database connection that will be used throughout the application.
 * All models will be registered with this instance.
 *
 * Features:
 * - Connection pooling for better performance
 * - Automatic retry on connection failure
 * - Custom logging using Winston
 * - Environment-specific configurations
 */
const sequelize = new Sequelize({
  dialect: env.DB_DIALECT,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,

  // Connection pool configuration
  pool: {
    max: 10, // Maximum number of connections
    min: 0, // Minimum number of connections
    acquire: 30000, // Maximum time (ms) to try getting connection
    idle: 10000, // Maximum time (ms) a connection can be idle
  },

  // Logging configuration
  logging: (msg) => logger.debug(msg),

  // Disable logging in test environment
  ...(env.NODE_ENV === 'test' && { logging: false }),

  // Model registration will happen in models/index.ts
  models: [], // Will be populated when models are loaded

  // Other options
  define: {
    timestamps: true, // Add createdAt and updatedAt automatically
    underscored: true, // Use snake_case for column names
    freezeTableName: true, // Use model name as table name (don't pluralize)
    paranoid: true, // Soft deletes (deletedAt column)
  },

  // Retry connection on failure
  retry: {
    max: 3,
  },
});

/**
 * Test database connection
 */
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');
  } catch (error) {
    logger.error('❌ Unable to connect to database:', error);
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

export default sequelize;
