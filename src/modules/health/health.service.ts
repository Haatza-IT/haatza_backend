import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime?: number;
  database?: 'connected' | 'disconnected';
  error?: string;
}

@Injectable()
export class HealthService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Liveness probe: confirms application process is running and responsive.
   */
  getLiveness(): HealthStatus {
    return {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe: checks active PostgreSQL database connectivity.
   * Safe read-only SELECT 1 query; never exposes connection strings or credentials.
   */
  async getReadiness(): Promise<HealthStatus> {
    try {
      const result: unknown = await this.prisma.$queryRaw`SELECT 1 as connected`;
      const isConnected = Array.isArray(result) && result.length > 0;
      if (!isConnected) {
        throw new Error('Database ping returned empty result');
      }
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'error',
        database: 'disconnected',
        error: 'Database connection unavailable',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

