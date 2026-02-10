import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

/**
 * JWT Payload Interface
 * 
 * Defines what data we store in the JWT token.
 * Keep it minimal - JWT tokens are sent with every request.
 */
export interface JwtPayload {
  sub: string; // User ID (standard JWT claim)
  email: string;
  role: string;
  iat?: number; // Issued at (added by JWT library)
  exp?: number; // Expiration (added by JWT library)
}

/**
 * JWT Strategy
 * 
 * This strategy validates JWT tokens and loads the user.
 * It's called automatically by JwtAuthGuard.
 * 
 * How JWT authentication works:
 * 1. User logs in with email/password
 * 2. Server validates credentials and generates JWT token
 * 3. Client stores token (usually in localStorage or cookie)
 * 4. Client sends token in Authorization header: "Bearer <token>"
 * 5. JwtStrategy extracts and verifies token
 * 6. If valid, loads user and attaches to request
 * 7. If invalid/expired, throws UnauthorizedException
 * 
 * Passport Strategy Pattern:
 * - PassportStrategy is a NestJS wrapper around Passport.js
 * - Passport handles the low-level JWT validation
 * - We just implement validate() method
 * - Return value is attached to request.user
 * 
 * NestJS vs Express:
 * Express: Manually verify JWT in middleware
 * NestJS: Declarative with Passport strategies
 * - More testable
 * - Better error handling
 * - Works with guards
 * - Type-safe
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Extract JWT from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Reject expired tokens
      ignoreExpiration: false,
      
      // Secret key for verifying token signature
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret',
    });
  }

  /**
   * Validate JWT payload
   * 
   * This method is called if JWT signature is valid and not expired.
   * We load the user to ensure they still exist and are active.
   * 
   * @param payload - Decoded JWT payload
   * @returns User object (will be attached to request.user)
   */
  async validate(payload: JwtPayload) {
    // Load user from database
    const user = await this.usersService.findOne(payload.sub);

    // Check if user is active
    if (!user?.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Return user (NestJS automatically attaches this to request.user)
    return user;
  }
}
