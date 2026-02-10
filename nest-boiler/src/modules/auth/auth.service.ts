import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';

/**
 * Auth Service
 * 
 * Handles authentication logic:
 * - User registration
 * - User login (credential validation)
 * - JWT token generation
 * 
 * Why separate from UsersService?
 * - Single Responsibility Principle
 * - UsersService: User CRUD operations
 * - AuthService: Authentication logic
 * - Easier to test and maintain
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register new user
   * Creates user and returns JWT token
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Create user (UsersService handles password hashing and validation)
    const user = await this.usersService.create(registerDto);

    // Update last login
    await this.usersService.updateLastLogin(user.id as string);

    // Generate JWT token
    return this.generateAuthResponse(user);
  }

  /**
   * Login user
   * Validates credentials and returns JWT token
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user by email (includes password)
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate JWT token
    return this.generateAuthResponse(user);
  }

  /**
   * Generate JWT token and format auth response
   * 
   * Private helper method to avoid code duplication
   */
  private generateAuthResponse(user: any): AuthResponseDto {
    // Create JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Sign JWT token
    const accessToken = this.jwtService.sign(payload);

    // Transform user entity to response DTO (excludes sensitive fields)
    const userResponse = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('jwt.expirationTime') || '1d',
      user: userResponse,
    };
  }

  /**
   * Validate user for Passport strategies
   * Used by JWT strategy to load user after token validation
   */
  async validateUser(userId: string): Promise<any> {
    return this.usersService.findOne(userId);
  }
}
