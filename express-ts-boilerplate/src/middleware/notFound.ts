import { Request, Response } from 'express';
import { errorResponse } from 'common/utils/response';

/**
 * 404 Not Found Handler
 *
 * This middleware handles requests to undefined routes
 * Should be registered after all other routes
 */
export const notFoundHandler = (req: Request, res: Response): Response => {
  return errorResponse(
    res,
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
};
