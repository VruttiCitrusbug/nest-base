import 'reflect-metadata';
import app from './app';
import { env } from 'config/env';
import logger from 'config/logger';
import { testConnection, closeConnection } from 'config/database';
import { handleUnhandledRejection, handleUncaughtException } from 'middleware/errorHandler';

// Import models to ensure they're registered
import 'database/models';

/**
 * Server Entry Point
 *
 * This file:
 * 1. Initializes database connection
 * 2. Starts the Express server
 * 3. Handles graceful shutdown
 * 4. Sets up process error handlers
 */

/**
 * Start Server
 */
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    logger.info('🔄 Connecting to database...');
    await testConnection();

    // Start Express server
    const PORT = env.PORT || 3000;
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API base URL: http://localhost:${PORT}/api`);
    });

    /**
     * Graceful Shutdown Handler
     */
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      // Close server first (stop accepting new requests)
      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Close database connection
          await closeConnection();
          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Process Error Handlers
 */
process.on('unhandledRejection', handleUnhandledRejection);
process.on('uncaughtException', handleUncaughtException);

/**
 * Initialize Server
 */
startServer();
