import winston from 'winston';
import { env } from 'config/env';

/**
 * Custom log format for better readability
 * Includes timestamp, log level, and message
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    // Include metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

/**
 * Console format for development (more readable)
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

/**
 * Winston logger instance
 *
 * Features:
 * - Console logging for all environments
 * - File logging for errors (error.log)
 * - File logging for all logs (combined.log)
 * - Different formats for console vs file
 */
const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: env.APP_NAME },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * If not in production, log to console with colorized output
 */
if (env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

/**
 * Export logger instance
 * Usage: logger.info('message'), logger.error('error message')
 */
export default logger;
