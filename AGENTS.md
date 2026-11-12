# Haatza Backend - NestJS Architecture

## Overview
Standalone NestJS backend for the Haatza platform with PostgreSQL, Prisma 7 ORM, and Zod validation.

## Architecture
- **Framework:** NestJS 12 + TypeScript
- **Database:** PostgreSQL with `@prisma/adapter-pg` and Prisma 7
- **Validation:** Zod schemas with custom NestJS `ZodValidationPipe`
- **Authentication:** Admin API Key (`x-admin-key` header / `Bearer` token) with `AdminAuthGuard`
- **Security:** Bcrypt (12 work factor), bank account masking, password stripping
