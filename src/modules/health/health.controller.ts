import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../../common/decorators/public.decorator';

/**
 * Health Controller
 * 
 * Provides health check endpoints for monitoring.
 * Essential for production deployments (Kubernetes, Docker, load balancers).
 * 
 * Health Indicators:
 * - Database: Check if DB connection is alive
 * - Memory (Heap): RAM usage
 * - Memory (RSS): Total memory usage
 * - Disk: Storage usage
 * 
 * These endpoints are typically called by:
 * - Load balancers (to route traffic only to healthy instances)
 * - Monitoring tools (Prometheus, DataDog, etc.)
 * - Kubernetes liveness/readiness probes
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  /**
   * Overall health check
   * Checks database and memory
   */
  @Get()
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Check overall application health' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  @ApiResponse({ status: 503, description: 'Application is unhealthy' })
  check() {
    return this.health.check([
      // Check database connection
      () => this.db.pingCheck('database'),
      
      // Check memory heap doesn't exceed 150MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Check RSS memory doesn't exceed 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  /**
   * Database health check
   */
  @Get('db')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Check database health' })
  checkDatabase() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  /**
   * Memory health check
   */
  @Get('memory')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Check memory usage' })
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }
}
