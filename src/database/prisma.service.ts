import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: pg.Pool;
  private keepAliveTimer?: NodeJS.Timeout;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined in .env');
    }

    // High-performance connection pool optimized for cloud PostgreSQL (Neon)
    const pool = new pg.Pool({
      connectionString,
      max: 20, // Max concurrent connections to pooler
      min: 2,  // Maintain warm connection baseline
      idleTimeoutMillis: 30000, // 30s idle before reclaiming
      connectionTimeoutMillis: 10000, // 10s connection timeout
      keepAlive: true,
      statement_timeout: 10000, // 10s query timeout to prevent hanging locks
    });

    pool.on('error', (err) => {
      // Prevent unhandled errors from terminating process
      console.error('[PostgreSQL Pool Error]', err.message);
    });

    const adapter = new PrismaPg(pool, {
      disposeExternalPool: true,
    });

    super({
      adapter,
    });

    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      // Pre-warm the connection pool with a fast ping query
      await this.$queryRaw`SELECT 1 as ping`;
      this.logger.log('Successfully connected to PostgreSQL database via Prisma 7 (Pre-warmed)');

      // Automated Keep-Alive: Pings Neon every 4 minutes to prevent serverless compute from going to sleep
      this.keepAliveTimer = setInterval(async () => {
        try {
          await this.$queryRaw`SELECT 1 as keepalive`;
        } catch {
          // Silent keepalive retry
        }
      }, 240000);
      if (this.keepAliveTimer.unref) {
        this.keepAliveTimer.unref(); // Do not block Node.js process exit
      }
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL database via Prisma 7', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
    }
    await this.$disconnect();
    try {
      await this.pool.end();
    } catch {
      // Ignored on teardown
    }
    this.logger.log('Disconnected from PostgreSQL database');
  }
}

