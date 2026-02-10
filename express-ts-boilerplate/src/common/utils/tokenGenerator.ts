/**
 * JWT Token Generator Helper
 *
 * This utility script helps generate JWT tokens for testing purposes.
 * You can use this to create tokens for different users and roles without
 * needing to implement a full login system.
 *
 * Usage:
 *   import { generateTestToken } from './path/to/tokenGenerator';
 *   const token = generateTestToken('user-id-123', 'admin');
 */

import { jwtService } from 'common/utils/jwt.service';

/**
 * Generate a test JWT token
 *
 * @param userId - User ID to include in token
 * @param role - User role ('admin' | 'user')
 * @returns JWT token string
 *
 * @example
 * const adminToken = generateTestToken('1', 'admin');
 * const userToken = generateTestToken('2', 'user');
 */
export function generateTestToken(userId: string, role: 'admin' | 'user'): string {
  return jwtService.generateToken({ id: userId, role });
}

/**
 * Example usage - run this file directly to generate test tokens
 *
 * Uncomment the following to generate example tokens:
 */

// Example 1: Generate admin token
// const adminToken = generateTestToken('1', 'admin');
// console.log('Admin Token:', adminToken);

// Example 2: Generate user token
// const userToken = generateTestToken('2', 'user');
// console.log('User Token:', userToken);
