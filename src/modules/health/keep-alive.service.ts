import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

@Injectable()
export class KeepAliveService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KeepAliveService.name);
  private timer?: NodeJS.Timeout;

  onModuleInit() {
    const isRender = process.env.RENDER || process.env.NODE_ENV === 'production';
    const externalUrl = process.env.RENDER_EXTERNAL_URL || 'https://haatza-backend.onrender.com';

    if (isRender) {
      this.logger.log(`[KeepAlive] Service initialized. Self-ping active for ${externalUrl}/health every 9 minutes.`);

      // Ping every 9 minutes (540,000 ms) to stay safely below Render's 15-minute idle spin-down threshold
      this.timer = setInterval(async () => {
        try {
          const start = Date.now();
          const res = await fetch(`${externalUrl}/health`, {
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
      }, 540000);

      if (this.timer.unref) {
        this.timer.unref();
      }
    }
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
