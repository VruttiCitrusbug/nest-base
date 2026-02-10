import { Request, Response, NextFunction } from 'express';
import logger from 'config/logger';

/**
 * Request Logger Middleware
 *
 * Logs incoming requests with method, path, and timing information
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    logger.info(`${method} ${originalUrl}`, {
      method,
      path: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      ip,
    });
  });

  next();
};
