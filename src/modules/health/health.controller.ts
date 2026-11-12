import { Controller, Get, Res, HttpStatus, Inject } from '@nestjs/common';
import type { Response } from 'express';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(
    @Inject(HealthService)
    private readonly healthService: HealthService,
  ) {}

  /**
   * Liveness probe: /health
   */
  @Get('health')
  getLiveness() {
    return this.healthService.getLiveness();
  }

  /**
   * Liveness probe: /api/health
   */
  @Get('api/health')
  getApiLiveness() {
    return this.healthService.getLiveness();
  }

  /**
   * Readiness probe: /health/ready
   */
  @Get('health/ready')
  async getReadiness(@Res() res: Response) {
    const health = await this.healthService.getReadiness();
    const status = health.status === 'ok' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(health);
  }

  /**
   * Readiness probe: /api/health/ready
   */
  @Get('api/health/ready')
  async getApiReadiness(@Res() res: Response) {
    const health = await this.healthService.getReadiness();
    const status = health.status === 'ok' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(health);
  }
}

