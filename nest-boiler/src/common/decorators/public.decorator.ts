import { SetMetadata } from '@nestjs/common';

/**
 * Public Decorator
 * 
 * Marks routes that should be accessible without authentication.
 * By default, you might want all routes protected and explicitly mark public ones.
 * 
 * Usage:
 * @Public()
 * @Post('/login')
 * login(@Body() loginDto: LoginDto) { ... }
 * 
 * This works with a global JWT guard that checks for this metadata.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
