# Haatza Backend - Complete Security Documentation

This document explains the security architecture, threat mitigations, and compliance safeguards implemented in the Haatza backend.

---

## 1. Password Security & Cryptography

### Why One-Way Password Hashing is Mandatory
Reversible encryption (e.g. AES, DES, RSA) requires a secret key. If the server or key is ever compromised, an attacker can decrypt every user password back to plaintext. 

In Haatza:
- We use **bcrypt** (via `bcryptjs`), a dedicated cryptographic password hashing function based on the Blowfish cipher.
- **Salt Rounds / Work Factor:** Set to `12`. Every password hash is generated with a unique, cryptographically random 128-bit salt.
- **Resistance:** bcrypt incorporates a computationally expensive key derivation schedule that makes GPU-accelerated brute-force and rainbow table attacks infeasible.
- **Incoming Field Mapping:** The client sends `passcode`, which is immediately hashed by `lib/password.ts` before reaching the database layer.

### Confidentiality Safeguards
1. **Never Logged:** Plaintext passcodes and hashes are excluded from server console logs.
2. **Never Returned:** The `UserMasterService` sanitization pipeline strips the `password` field from every API response object (`sanitizeUserResponse`).
3. **No Manually Supplied Hashes:** Endpoints do not accept pre-computed hashes from clients.

---

## 2. Privileged Role Protection & Administrator Authorization

### Threat Model: Unauthorized Role Escalation
If internal endpoints such as `/api/haatza_employee` or `/api/haatza_nest_experts` were public, any authenticated or unauthenticated attacker could issue a POST request to grant themselves administrative or internal company privileges.

### Implemented Defense: `middleware/admin-auth.ts`
1. **Authentication Guard:** Every request to `/api/haatza_employee` and `/api/haatza_nest_experts` passes through `verifyAdminAuthorization`.
2. **Supported Header Formats:**
   - Dedicated header: `x-admin-key: <secret>`
   - Standard authorization header: `Authorization: Bearer <secret>`
3. **HTTP Status Differentiation:**
   - Missing header $\rightarrow$ **`401 Unauthorized`**
   - Invalid key $\rightarrow$ **`403 Forbidden`**
4. **Environment Secret:** Configurable via `ADMIN_API_KEY` in `.env`.

---

## 3. Sensitive Data Protection & Masking

### Bank Account Numbers
Displaying complete bank account numbers exposes customers and merchants to social engineering and financial fraud.
- In `modules/user-master/user-master.utils.ts`, the `maskAccountNumber` utility automatically transforms account numbers:
  - `"50100123456789"` $\rightarrow$ `"XXXXXXXXXX6789"`
  - Only the last 4 digits are revealed for verification purposes.

### Parameter Tampering & Mass Assignment Protection
- All Zod schemas (`modules/user-master/user-master.schema.ts`) enforce `.strict()`.
- Public registration endpoints will reject requests that attempt to inject:
  - `userId` (must be auto-generated)
  - `sellerId` (must be auto-generated)
  - `referralCode` (must be auto-generated)
  - `isHaatzaEmployee` (defaults to false)
  - `isNestExpert` (defaults to false)
  - `isSeller` (managed by seller endpoint only)

---

## 4. Database Security & Query Safety

### SQL Injection Prevention
- All database queries are executed through **Prisma ORM 7**.
- Prisma uses parameterized SQL queries exclusively. User-supplied inputs are never concatenated directly into raw SQL strings.

### Concurrency & Unique Constraints
- High-concurrency duplicate registration attempts (such as two simultaneous signups with the same email or phone) are stopped at two levels:
  1. Service-level pre-check (`findByEmailOrPhone`).
  2. PostgreSQL database-level unique constraints (`email_key`, `phoneNumber_key`, `referralCode_key`, `sellerId_key`).
- Database constraint violation code `P2002` is safely translated by `utils/api-error.ts` into a friendly HTTP 409 Conflict response without exposing raw database errors or stack traces to clients.

---

## 5. Environment Variables Protection

- Sensitive configuration keys are stored in `.env`.
- `.env` and `.env*` are listed in `.gitignore` to prevent secret leaks to GitHub.
- A sanitized `.env.example` template is provided to document configuration requirements without leaking secrets.

---

## 6. Current Security Checklist & Future Work

| Security Control | Current Status | Notes |
| :--- | :--- | :--- |
| **Bcrypt Password Hashing (Cost 12)** | Implemented | Salted one-way hash in `lib/password.ts`. |
| **Password Redaction in Responses** | Implemented | Sanitized before returning JSON. |
| **Bank Account Masking** | Implemented | `maskAccountNumber` shows only last 4 digits. |
| **Strict Schema Filtering** | Implemented | Zod `.strict()` prevents parameter injection. |
| **Admin Route Protection** | Implemented | Requires `x-admin-key` or Bearer token. |
| **SQL Injection Defense** | Implemented | Guaranteed by Prisma parameterized queries. |
| **JWT / Session Authentication** | Future Work | Login and token generation will be added in auth phase. |
| **Rate Limiting** | Future Work | Recommend adding Upstash / Redis rate limiter to prevent signup spam. |
| **CORS Policy** | Future Work | Configure allowed origins when frontend domain is established. |

