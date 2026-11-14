import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Multi-tenant shared hosting platforms where arbitrary third-party users
 * can register subdomains. Wildcard subdomain matching (*.vercel.app, *.onrender.com, etc.)
 * is strictly forbidden on these domains to prevent unauthorized third-party projects
 * from making credentialed cross-origin requests.
 */
export const DISALLOWED_WILDCARD_DOMAINS = [
  'vercel.app',
  'onrender.com',
  'netlify.app',
  'github.io',
  'pages.dev',
  'azurewebsites.net',
  'herokuapp.com',
  'firebaseapp.com',
  'fly.dev',
  'railway.app',
  'surge.sh',
  'amplifyapp.com',
  'cloudfront.net',
  'amazonaws.com',
];

/**
 * Resolves the list of explicitly configured frontend origins.
 * Reads environment variables:
 * - CORS_ORIGINS (comma-separated, e.g. "https://haatza.com,https://app.haatza.com")
 * - CORS_ALLOWED_ORIGINS (legacy alias)
 * - FRONTEND_URL (single or comma-separated URL)
 *
 * Normalizes origins by trimming whitespace and removing trailing slashes.
 */
export function getAllowedOrigins(): string[] {
  const envOrigins =
    process.env.CORS_ORIGINS ||
    process.env.CORS_ALLOWED_ORIGINS ||
    process.env.FRONTEND_URL;

  const originsSet = new Set<string>();

  if (envOrigins) {
    envOrigins
      .split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter((origin) => origin.length > 0)
      .forEach((origin) => originsSet.add(origin));
  }

  // Common local development and testing origins
  const defaultLocalOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4200',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
  ];

  defaultLocalOrigins.forEach((origin) => originsSet.add(origin));

  return Array.from(originsSet);
}

/**
 * Validates whether an incoming HTTP request origin is permitted.
 *
 * Security rules:
 * 1. Exact match against configured allowlist (case-insensitive, normalized).
 *    Supports exact origins on any domain, including Vercel and Render (e.g. "https://haatza.vercel.app").
 * 2. Localhost and 127.0.0.1 on any port for local development convenience.
 * 3. Wildcard subdomain matching ONLY on trusted custom domains (e.g. "https://*.haatza.com").
 *    Wildcards are strictly rejected for shared multi-tenant hosting platforms (e.g. *.vercel.app, *.onrender.com).
 */
export function isOriginAllowed(requestOrigin: string, allowedOrigins: string[]): boolean {
  if (!requestOrigin) return false;
  const normalized = requestOrigin.trim().replace(/\/+$/, '').toLowerCase();

  // 1. Exact match in allowlist (case-insensitive, without trailing slash)
  if (allowedOrigins.some((allowed) => allowed.trim().replace(/\/+$/, '').toLowerCase() === normalized)) {
    return true;
  }

  // 2. Allow all localhost & 127.0.0.1 ports for local development
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(normalized)) {
    return true;
  }

  // 3. Match wildcard domains ONLY on trusted custom domains
  for (const allowed of allowedOrigins) {
    const trimmedAllowed = allowed.trim().replace(/\/+$/, '').toLowerCase();
    if (!trimmedAllowed.includes('*')) {
      continue;
    }

    // Extract hostname portion of the wildcard pattern
    let hostnamePattern = trimmedAllowed;
    let protocol = 'https?:\\/\\/';
    if (trimmedAllowed.startsWith('https://')) {
      protocol = 'https:\\/\\/';
      hostnamePattern = trimmedAllowed.slice(8);
    } else if (trimmedAllowed.startsWith('http://')) {
      protocol = 'http:\\/\\/';
      hostnamePattern = trimmedAllowed.slice(7);
    }

    // Check if the wildcard targets a shared multi-tenant hosting platform
    const isSharedHosting = DISALLOWED_WILDCARD_DOMAINS.some(
      (sharedDomain) => hostnamePattern.endsWith(sharedDomain)
    );
    if (isSharedHosting) {
      // Disallow wildcards on shared public hosting (must be configured as exact origin instead)
      continue;
    }

    // Escape special regex characters except the wildcard asterisk
    const escapedBase = hostnamePattern
      .replace(/^\*\./, '')
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&');

    // Strict regex matching valid subdomains of the custom trusted domain:
    // e.g. "https://*.haatza.com" matches "https://app.haatza.com" or "https://staging.dev.haatza.com"
    // but will NEVER match "https://evil-haatza.com" or "https://haatza.com.evil.com"
    const wildcardRegex = new RegExp(
      `^${protocol}([a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.)?${escapedBase}(?::[0-9]+)?$`
    );

    if (wildcardRegex.test(normalized)) {
      return true;
    }
  }

  return false;
}

async function bootstrap() {
  // Explicit body parser control to avoid double-parsing or conflicts
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // High-resolution response timing middleware for performance auditing and observability
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = performance.now();
    const originalEnd = res.end;
    res.end = function (...args: any[]) {
      const duration = (performance.now() - start).toFixed(2);
      if (!res.headersSent) {
        res.setHeader('X-Response-Time', `${duration}ms`);
        res.setHeader('Server-Timing', `total;dur=${duration}`);
      }
      return (originalEnd as any).apply(this, args);
    };
    next();
  });

  // 1. Robust JSON & URL-encoded request body parsing with trailing-comma fault tolerance
  app.use(express.text({ type: 'application/json', limit: '100kb' }));
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (typeof req.body === 'string') {
      const trimmed = req.body.trim();
      if (!trimmed) {
        req.body = {};
        return next();
      }
      try {
        req.body = JSON.parse(trimmed);
      } catch {
        try {
          // Lenient parser: automatically strips accidental trailing commas (e.g. {"key": "val",})
          let cleaned = trimmed;
          let prev: string;
          do {
            prev = cleaned;
            cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
          } while (cleaned !== prev);
          req.body = JSON.parse(cleaned);
        } catch (err) {
          return next(err);
        }
      }
    }
    next();
  });
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

  // 3. Global Cross-Origin Resource Sharing (CORS) Configuration
  // Applies globally to all existing and future API routes
  app.enableCors({
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
      if (!requestOrigin) {
        return callback(null, true);
      }

      if (isOriginAllowed(requestOrigin, allowedOrigins)) {
        return callback(null, true);
      }

      // Origin not in allowlist
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-admin-key',
      'x-access-token',
      'x-refresh-token',
      'Accept',
      'X-Requested-With',
      'Origin',
    ],
    // Only access tokens and authorization headers are exposed to JavaScript.
    // Refresh tokens are exclusively stored in secure HttpOnly cookies and never exposed.
    exposedHeaders: [
      'x-access-token',
      'Authorization',
      'X-Response-Time',
      'Server-Timing',
    ],
    maxAge: 86400, // 24 hours preflight cache duration
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Global exception filter preserving exact JSON error contract
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NestJS server running on port ${port}`);
}

bootstrap();
