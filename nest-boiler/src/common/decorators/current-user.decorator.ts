import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUser Decorator
 * 
 * This parameter decorator extracts the current user from the request object.
 * The user is attached to the request by the JWT strategy after authentication.
 * 
 * Usage in controller:
 * @Get('/profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * 
 * Benefits:
 * - Clean controller methods (no need to access req.user directly)
 * - Type-safe (TypeScript knows the user type)
 * - Can extract specific user properties if needed
 * 
 * NestJS vs Express:
 * In Express: const user = req.user
 * In NestJS: @CurrentUser() user: User (cleaner and type-safe)
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // If data is provided, return specific property
    // Usage: @CurrentUser('id') userId: string
    return data ? user?.[data] : user;
  },
);
