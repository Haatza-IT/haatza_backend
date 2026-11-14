import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller(['health', 'api/health'])
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check() {
    return {
      status: 'ok',
      service: 'haatza-backend',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    };
  }
}
