import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class KeepAliveService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KeepAliveService.name);
  private timer?: NodeJS.Timeout;
  private initialTimeout?: NodeJS.Timeout;

  onModuleInit() {
    const externalUrl = process.env.RENDER_EXTERNAL_URL || 'https://haatza-backend.onrender.com';

    this.logger.log(`[KeepAlive] Service initialized. Self-ping active for ${externalUrl}/health every 3 minutes.`);

    const ping = async () => {
      try {
        const start = Date.now();
        const res = await fetch(`${externalUrl}/health`, {
          headers: {
            'User-Agent': 'Haatza-KeepAlive/1.0',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000),
        });
        const latency = Date.now() - start;
        if (res.ok) {
          this.logger.log(`[KeepAlive] Ping to ${externalUrl}/health successful (${latency}ms). Instance remains warm.`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`[KeepAlive] Ping failed: ${msg}`);
      }
    };

    // Immediate warm-up ping 5 seconds after server start
    this.initialTimeout = setTimeout(ping, 5000);
    if (this.initialTimeout.unref) {
      this.initialTimeout.unref();
    }

    // High-frequency ping every 3 minutes (180,000 ms) so Render free tier NEVER spins down
    this.timer = setInterval(ping, 180000);
    if (this.timer.unref) {
      this.timer.unref();
    }
  }

  onModuleDestroy() {
    if (this.initialTimeout) {
      clearTimeout(this.initialTimeout);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

