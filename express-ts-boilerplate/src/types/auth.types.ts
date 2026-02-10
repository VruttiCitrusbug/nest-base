import { User } from '@modules/user/user.model';

/**
 * User role type
 * Matches the roles from FastAPI implementation
 */
export type UserRole = 'admin' | 'user';

/**
 * JWT Token payload
 */
export interface TokenPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Extend Express Request to include authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      state?: {
        user?: User;
      };
    }
  }
}

export {};
