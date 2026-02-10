import { Request, Response, NextFunction } from 'express';
import { jwtService } from 'common/utils/jwt.service';
import { User } from 'modules/user/user.model';
import logger from 'config/logger';
import 'types/auth.types'; // Import to extend Express types

/**
 * JWT Bearer Authentication Middleware
 *
 * Validates JWT token from Authorization header
 * Mirrors FastAPI's JWTBearer class functionality
 *
 * @throws 401 if token is missing, invalid, or expired
 * @attaches req.user with token payload (id, role)
 */
export const jwtBearer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Auth Token is missing or invalid',
      });
      return;
    }

    // Check Bearer scheme
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        success: false,
        message: 'Auth Token is missing or invalid',
      });
      return;
    }

    const token = parts[1];

    // Validate token
    const tokenData = jwtService.validateUserToken(token);
    if (!tokenData) {
      res.status(401).json({
        success: false,
        message: 'Auth Token is missing or invalid',
      });
      return;
    }

    // Attach token data to request
    req.user = tokenData;
    next();
  } catch (error) {
    logger.error('JWT authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Auth Token is missing or invalid',
    });
  }
};

/**
 * Role-Based Access Control Middleware Factory
 *
 * Creates middleware that verifies user has required role
 * Mirrors FastAPI's RoleRequiredBearer class functionality
 *
 * @param role - Required role ('admin' | 'user')
 * @returns Express middleware function
 * @throws 401 if token is invalid
 * @throws 403 if user doesn't have required role
 * @attaches req.state.user with full User model instance
 *
 * @example
 * // Protect admin-only route
 * app.get('/admin/stats', roleRequired('admin'), (req, res) => {
 *   // req.state.user is available and has role='admin'
 *   res.json({ message: 'Admin data' });
 * });
 */
export const roleRequired = (role: 'admin' | 'user') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // First, run JWT authentication
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: 'Auth Token is missing or invalid',
        });
        return;
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({
          success: false,
          message: 'Auth Token is missing or invalid',
        });
        return;
      }

      const token = parts[1];
      const tokenData = jwtService.validateUserToken(token);

      if (!tokenData) {
        res.status(401).json({
          success: false,
          message: 'Auth Token is missing or invalid',
        });
        return;
      }

      // Verify user exists in database and has correct role
      const user = await User.findByPk(tokenData.id);

      if (!user) {
        res.status(403).json({
          success: false,
          message: 'You are not authorized to perform this action.',
        });
        return;
      }

      // Check if user has required role
      if (user.role !== role) {
        res.status(403).json({
          success: false,
          message: 'You are not authorized to perform this action.',
        });
        return;
      }

      // Attach user to request state
      req.user = tokenData;
      req.state = { user };

      next();
    } catch (error) {
      logger.error('Role-based authentication error:', error);
      res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action.',
      });
    }
  };
};
