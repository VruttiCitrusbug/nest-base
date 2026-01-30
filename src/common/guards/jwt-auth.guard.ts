import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT Authentication Guard
 * 
 * This guard protects routes by requiring a valid JWT token.
 * It extends Passport's AuthGuard and adds support for public routes.
 * 
 * How it works:
 * 1. Check if route is marked as @Public()
 * 2. If public, allow access without authentication
 * 3. If protected, validate JWT token using JWT strategy
 * 4. If token is valid, attach user to request and allow access
 * 5. If token is invalid, throw UnauthorizedException
 * 
 * Guards vs Middleware:
 * - Guards run AFTER middleware but BEFORE interceptors
 * - Guards have access to ExecutionContext (knows about controller/handler)
 * - Guards return boolean (allow/deny access)
 * - Guards can use dependency injection
 * 
 * When to use Guards vs Middleware:
 * - Guards: Authentication, authorization (access control decisions)
 * - Middleware: Logging, request parsing, CORS (request processing)
 * - Interceptors: Response transformation, caching (before/after handler)
 * - Pipes: Validation, transformation (input data processing)
 * 
 * NestJS vs Express:
 * Express middleware: app.use(authenticateJWT)
 * NestJS guard: @UseGuards(JwtAuthGuard) or globally applied
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determine if the route can be activated (accessed)
   */
  canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // If not public, use default JWT validation from Passport
    return super.canActivate(context);
  }
}
