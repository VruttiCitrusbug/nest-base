import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

/**
 * Health Module
 * 
 * Uses @nestjs/terminus for health checks.
 * Terminus provides indicators for common services (DB, Redis, HTTP, etc.)
 */
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
