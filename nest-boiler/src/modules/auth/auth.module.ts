import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

/**
 * Auth Module
 * 
 * Handles authentication functionality.
 * 
 * Key Imports:
 * - PassportModule: Provides Passport.js integration
 * - JwtModule: Provides JWT token generation/validation
 * - UsersModule: Need UsersService to validate users
 * 
 * JwtModule.registerAsync():
 * Dynamically configures JWT settings from ConfigService.
 * 
 * Dependency Chain:
 * AuthController → AuthService → UsersService → UserRepository
 *                ↓
 *           JwtService
 * 
 * JwtStrategy is a provider because it needs to be injectable.
 * It's used by JwtAuthGuard automatically via Passport.
 */
@Module({
  imports: [
    UsersModule, // Import to use UsersService
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          secret: configService.get<string>('jwt.secret') || 'default-secret',
          signOptions: {
            expiresIn: (configService.get<string>('jwt.expirationTime') || '1d') as any,
          },
        } as JwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy], // Export for use in other modules
})
export class AuthModule {}
