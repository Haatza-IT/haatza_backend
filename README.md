# Haatza Backend

Production-ready backend for the **Haatza** e-commerce ecosystem, built with **Next.js 16 (App Router)**, **TypeScript**, **PostgreSQL**, and **Prisma ORM 7**.

---

## 🚀 Technology Stack

- **Framework:** Next.js 16.4.6 (App Router)
- **Runtime:** Node.js v20+ (Tested on v26)
- **Database:** PostgreSQL 16+
- **ORM:** Prisma ORM 7.10.1
- **Driver Adapter:** `@prisma/adapter-pg` with `pg`
- **Validation:** Zod 4
- **Password Security:** Salted bcrypt (12 rounds) via `bcryptjs`

---

## 📁 Architecture Overview

The project is structured according to **Clean Layered Architecture**:
- **Route Handlers (`app/api/...`):** Accept HTTP requests and return standard responses.
- **Validation Layer (`validations/` & `modules/user-master/user-master.schema.ts`):** Enforces data boundaries using Zod.
- **Service Layer (`modules/user-master/user-master.service.ts`):** Implements core business rules, password hashing, and ID generation.
- **Repository Layer (`modules/user-master/user-master.repository.ts`):** Isolates all database operations using Prisma Client.
- **Middleware (`middleware/admin-auth.ts`):** Protects privileged endpoints with administrator credentials.
- **Singletons (`lib/prisma.ts`, `lib/password.ts`):** Connection pool and cryptographic utilities.

---

## 📋 Prerequisites

- **Node.js** v20.x or higher
- **PostgreSQL** running locally or in the cloud on port `5432`

---

## ⚙️ Installation & Setup

1. **Clone & Install Dependencies:**
   ```powershell
   git clone <repo-url>
   cd haatza_backend
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env`:
   ```powershell
   cp .env.example .env
   ```
   Configure your database URL and admin key:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/haatza_backend?schema=public"
   ADMIN_API_KEY="haatza_admin_secret_key_2026"
   ```

3. **Prisma Schema Validation & Client Generation:**
   ```powershell
   # Validate schema
   npx prisma validate --config prisma7.config.ts

   # Generate Prisma Client to src/generated/prisma
   npx prisma generate --config prisma7.config.ts
   ```

4. **Apply Database Migrations:**
   ```powershell
   npx prisma migrate dev --config prisma7.config.ts
   ```

5. **Start the Development Server:**
   ```powershell
   npm run dev
   ```
   Server starts at `http://localhost:3000`.

---

## 📡 Four Core Registration APIs

| API Name | Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Member Registration** | `POST` | `/api/haatza_members` | Public | Onboards shopper members with auto-generated UUID and referral code. |
| **Seller Registration** | `POST` | `/api/haatza_seller` | Public | Onboards merchants with address, coordinates, bank, PAN, and Mod-36 GSTIN verification. |
| **Employee Role Assignment** | `POST` | `/api/haatza_employee` | Admin Only | Assigns employee status to an existing `userId`. Requires `x-admin-key`. |
| **Nest Expert Role Assignment** | `POST` | `/api/haatza_nest_experts` | Admin Only | Assigns Nest Expert status to an existing `userId`. Requires `x-admin-key`. |

---

## 🧪 Testing with Postman

A pre-configured Postman Collection is provided at the root:  
**`haatza_user_masters_postman_collection.json`**

Import this file directly into Postman (**File > Import**) to test:
- Member signup, duplicate detection, and invalid inputs.
- Seller registration with Indian Mod-36 GSTIN validation.
- Unauthorized (`401`), Forbidden (`403`), and successful (`200`) role promotions.

---

## 📚 Complete Project Documentation (`docs/`)

Deep dive into any component using our comprehensive technical guides:

- [**Existing Project Audit**](docs/PROJECT_AUDIT.md): Initial code inspection report.
- [**Project Structure & Component Map**](docs/PROJECT_STRUCTURE.md): File matrix and high-level architectural diagram.
- [**Database Documentation**](docs/DATABASE_DOCUMENTATION.md): Complete field-by-field reference of `user_masters`.
- [**API Documentation**](docs/API_DOCUMENTATION.md): Endpoint payloads, response envelopes, and error scenarios.
- [**Validation Architecture**](docs/VALIDATION_DOCUMENTATION.md): Zod schemas and the Mod-36 GSTIN checksum algorithm.
- [**Security Documentation**](docs/SECURITY_DOCUMENTATION.md): Bcrypt hashing, admin guards, and data masking.
- [**Migration History**](docs/MIGRATION_HISTORY.md): Database migration logs and verification results.
- [**Postman Testing Guide**](docs/POSTMAN_TESTING.md): Step-by-step API testing guide.
- [**Beginner-Friendly Learning Guide**](docs/LEARNING_GUIDE.md): Concepts and request flow sequence diagrams.
