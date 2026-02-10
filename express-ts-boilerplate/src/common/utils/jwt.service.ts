import jwt from 'jsonwebtoken';
import type { StringValue } from "ms";

import { env } from 'config/env';
import logger from 'config/logger';

/**
 * Token payload interface
 * Matches the structure used in FastAPI JWT implementation
 */
export interface TokenPayload {
  id: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

/**
 * JWT Service
 *
 * Handles JWT token generation and validation
 * Mirrors functionality from FastAPI's JWTService
 */
export class JWTService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.expiresIn = env.JWT_EXPIRES_IN;
  }

  /**
   * Generate a JWT token
   *
   * @param payload - Token payload containing user id and role
   * @returns Signed JWT token string
   */
  generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    try {
      const options: jwt.SignOptions = {
        expiresIn: this.expiresIn as StringValue,
        algorithm: 'HS256',
      };

      return jwt.sign(payload, this.secret, options);
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  /**
   * Verify and decode a JWT token
   *
   * @param token - JWT token string to verify
   * @returns Decoded token payload or null if invalid
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret, {
        algorithms: ['HS256'],
      }) as TokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn('JWT token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid JWT token');
      } else {
        logger.error('Error verifying JWT token:', error);
      }
      return null;
    }
  }

  /**
   * Decode a JWT token without verification
   *
   * @param token - JWT token string to decode
   * @returns Decoded token payload or null if malformed
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      logger.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Validate user token (alias for verifyToken)
   * Matches the method name from FastAPI implementation
   */
  validateUserToken(token: string): TokenPayload | null {
    return this.verifyToken(token);
  }
}

// Export singleton instance
export const jwtService = new JWTService();
