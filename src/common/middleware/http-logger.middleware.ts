import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * HTTP Logger Middleware
 * 
 * This middleware logs all incoming HTTP requests with timing information.
 * It runs BEFORE guards, interceptors, and route handlers.
 * 
 * Middleware vs Interceptors:
 * - Middleware: Access to raw req/res, runs first, doesn't know about route context
 * - Interceptors: Access to execution context, knows about controller/handler, can transform response
 * 
 * Use middleware for:
 * - Request parsing, body parsing
 * - CORS, security headers
 * - Low-level logging
 * - Session management
 * 
 * Use interceptors for:
 * - Response transformation
 * - Caching
 * - Timeout handling
 * - Business logic timing
 */
@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Log when response finishes
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength || 0}b - ${userAgent} ${ip} - ${responseTime}ms`,
      );
    });

    next();
  }
}
