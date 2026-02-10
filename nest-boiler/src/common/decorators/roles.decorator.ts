import { SetMetadata } from '@nestjs/common';

/**
 * Roles Decorator
 * 
 * This custom decorator marks routes that require specific roles.
 * It stores role metadata that can be retrieved by the RolesGuard.
 * 
 * Usage in controller:
 * @Roles('admin', 'manager')
 * @Get('/admin-only')
 * getAdminData() { ... }
 * 
 * How it works:
 * 1. SetMetadata stores custom metadata on the route handler
 * 2. Guards can access this metadata using Reflector
 * 3. RolesGuard checks if user has required roles
 * 
 * NestJS vs Express:
 * In Express, you might create a middleware: requireRoles(['admin'])
 * In NestJS, decorators + guards provide:
 * - Better type safety
 * - Declarative syntax
 * - Integration with dependency injection
 * - Ability to combine multiple guards
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
