import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

function getAllowedOrigins(): string[] {
  const configured = process.env.CORS_ALLOWED_ORIGINS;
  if (configured) {
    return configured
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  // Default allowed origins for local development and staging
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
  ];
}

async function bootstrap() {
  // Explicit body parser control to avoid double-parsing or conflicts
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // 1. Explicit JSON & URL-encoded request body size limit (100KB)
  // Rejects oversized request bodies with HTTP 413 Payload Too Large
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 2. HTTP Security Headers via Helmet
  // Configured specifically for high-security JSON REST API operations
  app.use(
    helmet({
      contentSecurityPolicy: false, // Pure JSON API: avoids injecting HTML CSP directives
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin API consumers
      hsts: {
        maxAge: 31536000, // 1 year Strict-Transport-Security on current host
        includeSubDomains: false, // Safe: avoids inadvertently forcing HTTPS across unconfigured subdomains
        preload: false, // Safe: avoids permanent submission to browser preload list before domain readiness
      },
      frameguard: { action: 'deny' }, // Clickjacking protection (X-Frame-Options: DENY)
      noSniff: true, // MIME-sniffing protection (X-Content-Type-Options: nosniff)
      hidePoweredBy: true, // Strips X-Powered-By: Express
    }),
  );

  // Enable graceful shutdown hooks for SIGTERM / SIGINT (critical for Docker & cloud runners)
  app.enableShutdownHooks();

  const allowedOrigins = getAllowedOrigins();

  // Production-safe Cross-Origin Resource Sharing (CORS) with explicit origin allowlist
  app.enableCors({
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, internal server-to-server)
      if (!requestOrigin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }

      // Origin not in allowlist
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
  });

  // Global exception filter preserving exact JSON error contract
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NestJS server running on port ${port}`);
}

bootstrap();

