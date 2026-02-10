import { Request, Response, NextFunction } from 'express';

/**
 * Async Handler Wrapper
 *
 * Wraps async route handlers to automatically catch errors
 * and pass them to the error handling middleware.
 *
 * This eliminates the need for try-catch blocks in every controller method.
 *
 * Usage:
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.findAll();
 *   return successResponse(res, users);
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
