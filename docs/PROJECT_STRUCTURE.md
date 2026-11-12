# Haatza Backend - Complete Project Structure & Component Map

This document maps the complete file and folder architecture of the Haatza backend.

---

## 1. Directory Tree Map

```text
haatza_backend/
│
├── app/                                    # Next.js App Router Root
│   ├── api/                                # HTTP API Route Handlers
│   │   ├── haatza_employee/
│   │   │   └── route.ts                    # API 3: Employee role assignment
│   │   ├── haatza_members/
│   │   │   └── route.ts                    # API 1: Member registration
│   │   ├── haatza_nest_experts/
│   │   │   └── route.ts                    # API 4: Nest Expert role assignment
│   │   └── haatza_seller/
│   │       └── route.ts                    # API 2: Seller registration
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── docs/                                   # Complete Technical Documentation
│   ├── API_DOCUMENTATION.md                # Endpoint specs, payloads, and status codes
│   ├── DATABASE_DOCUMENTATION.md           # Field-by-field user_masters reference
│   ├── LEARNING_GUIDE.md                   # Beginner concepts and sequence diagrams
│   ├── MIGRATION_HISTORY.md                # Applied database migration changelog
│   ├── POSTMAN_TESTING.md                  # Test suites, scenarios, and sample bodies
│   ├── PROJECT_AUDIT.md                    # Initial inspection audit report
│   ├── PROJECT_STRUCTURE.md                # This file: architecture and component map
│   ├── SECURITY_DOCUMENTATION.md           # Hashing, authorization, and data masking
│   └── VALIDATION_DOCUMENTATION.md         # Zod schemas and Mod-36 GSTIN algorithm
│
├── lib/                                    # Core Framework Singletons
│   ├── password.ts                         # Bcrypt password hashing & verification
│   └── prisma.ts                           # Prisma Client singleton with PG adapter
│
├── middleware/                             # Route Guards
│   └── admin-auth.ts                       # Admin authorization verification guard
│
├── modules/                                # Domain-Driven Feature Modules
│   └── user-master/
│       ├── user-master.constants.ts        # Constants, status defaults, messages
│       ├── user-master.repository.ts       # Database queries (Prisma Client)
│       ├── user-master.schema.ts           # Endpoint request validation schemas
│       ├── user-master.service.ts          # Business logic, orchestration
│       ├── user-master.types.ts            # DTOs and TypeScript types
│       └── user-master.utils.ts            # Data masking & sanitization helpers
│
├── prisma/                                 # Database Schema & Migrations
│   ├── migrations/
│   │   ├── 20261110045801_create_category/ # Category table migration
│   │   ├── 20261110050757_create_product/  # Product table migration
│   │   ├── 20261110112253_create_user_masters/ # UserMaster table migration
│   │   └── migration_lock.toml
│   └── schema.prisma                       # Declarative schema models
│
├── public/                                 # Static public assets
│
├── src/
│   └── generated/
│       └── prisma/                         # Generated Prisma Client 7.10.1 files
│
├── utils/                                  # Common Reusable Utilities
│   ├── api-error.ts                        # Error response builder & DB error translator
│   ├── api-response.ts                     # Success response builder & Zod error formatter
│   └── generate-referral-code.ts           # Referral code & seller ID generators
│
├── .env                                    # Environment variables (Ignored by Git)
├── .env.example                            # Sanitized configuration template
├── .gitignore                              # Git exclusion rules
├── AGENTS.md                               # Agent guidelines
├── eslint.config.mjs                       # ESLint 9 configuration
├── haatza_user_masters_postman_collection.json # Exported Postman collection
├── next-env.d.ts                           # Next.js TypeScript definitions
├── next.config.ts                          # Next.js framework configuration
├── package-lock.json                       # Exact dependency lockfile
├── package.json                            # Package manifests and scripts
├── prisma7.config.ts                       # Prisma 7 CLI configuration
├── README.md                               # Project entrypoint documentation
└── tsconfig.json                           # TypeScript compiler configuration
```

---

## 2. Component Responsibility & Dependency Matrix

| File Path | Primary Responsibility | Used By | Dependencies |
| :--- | :--- | :--- | :--- |
| **`app/api/haatza_members/route.ts`** | Receives HTTP POST for member registration, calls Zod validation, invokes service, returns HTTP response. | External API consumers | `modules/user-master/user-master.schema`, `modules/user-master/user-master.service`, `utils/api-response`, `utils/api-error` |
| **`app/api/haatza_seller/route.ts`** | Receives HTTP POST for seller registration, validates profile/tax/bank details, returns HTTP response. | External API consumers | `modules/user-master/user-master.schema`, `modules/user-master/user-master.service`, `utils/api-response`, `utils/api-error` |
| **`app/api/haatza_employee/route.ts`**| Receives HTTP POST for employee role update, verifies admin key, updates role. | Internal Admin tools | `middleware/admin-auth`, `modules/user-master/user-master.schema`, `modules/user-master/user-master.service`, `utils/api-response`, `utils/api-error` |
| **`app/api/haatza_nest_experts/route.ts`**| Receives HTTP POST for Nest Expert role update, verifies admin key, updates role. | Internal Admin tools | `middleware/admin-auth`, `modules/user-master/user-master.schema`, `modules/user-master/user-master.service`, `utils/api-response`, `utils/api-error` |
| **`middleware/admin-auth.ts`** | Validates `x-admin-key` or `Authorization: Bearer <key>` against `ADMIN_API_KEY`. | Employee & Nest Expert routes | `utils/api-response` |
| **`modules/user-master/user-master.service.ts`**| Business logic orchestrator: duplicate checks, password hashing, ID generation, response sanitization. | Route handlers | `modules/user-master/user-master.repository`, `lib/password`, `utils/generate-referral-code`, `modules/user-master/user-master.utils` |
| **`modules/user-master/user-master.repository.ts`**| Executes PostgreSQL queries via Prisma Client. Isolates SQL/DB operations. | `user-master.service.ts` | `lib/prisma.ts`, `modules/user-master/user-master.types` |
| **`modules/user-master/user-master.schema.ts`**| Composes Zod request validation schemas for all four endpoints. | Route handlers | `validations/*` |
| **`modules/user-master/user-master.utils.ts`** | Sanitizes user data (removes password) and masks bank account numbers. | `user-master.service.ts` | `modules/user-master/user-master.types` |
| **`validations/tax.validation.ts`** | Validates PAN format and Indian Mod-36 GSTIN checksum. | `user-master.schema.ts` | `zod` |
| **`validations/phone.validation.ts`**| Normalizes and validates Indian 10-digit mobile numbers. | `user-master.schema.ts` | `zod` |
| **`validations/banking.validation.ts`**| Validates bank account number and 11-char IFSC codes. | `user-master.schema.ts` | `zod` |
| **`validations/email.validation.ts`**| Normalizes and validates email addresses. | `user-master.schema.ts` | `zod` |
| **`validations/common.validation.ts`**| Validates 6-digit PIN codes, coordinates, and UUIDs. | `user-master.schema.ts` | `zod` |
| **`lib/password.ts`** | Hashes and verifies passwords using bcrypt (12 salt rounds). | `user-master.service.ts` | `bcryptjs` |
| **`lib/prisma.ts`** | Configures and exports a singleton PrismaClient with `@prisma/adapter-pg`. | `user-master.repository.ts` | `@prisma/adapter-pg`, `@prisma/client`, `dotenv` |

---

## 3. High-Level Architecture Flow Diagram

```text
[HTTP Client / Postman]
         │
         ▼
[Next.js Route Handler] (app/api/.../route.ts)
         │
         ├───► [Middleware] (middleware/admin-auth.ts) [For Privileged APIs]
         │
         ├───► [Validation Layer] (modules/user-master/user-master.schema.ts)
         │            │
         │            └── Uses (validations/email, phone, banking, tax)
         │
         ▼
[Service Layer] (modules/user-master/user-master.service.ts)
         │
         ├───► [Password Utility] (lib/password.ts -> bcrypt)
         ├───► [ID & Code Generator] (utils/generate-referral-code.ts)
         ├───► [Sanitizer / Masking] (modules/user-master/user-master.utils.ts)
         │
         ▼
[Repository Layer] (modules/user-master/user-master.repository.ts)
         │
         ▼
[Prisma Client Singleton] (lib/prisma.ts with @prisma/adapter-pg)
         │
         ▼
[PostgreSQL Database] (haatza_backend @ localhost:5432)
```

