import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Roles Guard
 * 
 * This guard implements Role-Based Access Control (RBAC).
 * It checks if the authenticated user has the required roles for a route.
 * 
 * How it works:
 * 1. Extract required roles from route metadata (set by @Roles decorator)
 * 2. If no roles required, allow access
 * 3. Get current user from request (set by JWT strategy)
 * 4. Check if user has at least one of the required roles
 * 5. Allow or deny access based on role match
 * 
 * Usage in controller:
 * @Roles('admin', 'manager')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('/sensitive-data')
 * getSensitiveData() { ... }
 * 
 * Guard Order Matters!
 * JwtAuthGuard must run BEFORE RolesGuard because:
 * - JwtAuthGuard authenticates and attaches user to request
 * - RolesGuard needs that user object to check roles
 * 
 * NestJS vs Express:
 * Express: Multiple middleware functions in order
 * NestJS: Multiple guards with clear separation of concerns
 * - JwtAuthGuard: "Who are you?" (Authentication)
 * - RolesGuard: "Are you allowed?" (Authorization)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request (attached by JWT strategy)
    const { user } = context.switchToHttp().getRequest();

    // User should exist if JWT guard ran first
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
