# Haatza Backend - Database Migration History

**Database:** PostgreSQL (`haatza_backend`)  
**ORM Tool:** Prisma ORM 7 (`prisma migrate`)  
**Configuration File:** `prisma7.config.ts`  
**Schema Path:** `prisma/schema.prisma`  
**Migrations Directory:** `prisma/migrations`  

---

## Migration Overview

Prisma tracks applied migrations in the PostgreSQL database table `_prisma_migrations`. The migration history in this project is strictly preserved and cumulative.

```text
prisma/migrations/
├── 20261110045801_create_category/
│   └── migration.sql
├── 20261110050757_create_product/
│   └── migration.sql
├── 20261110112253_create_user_masters/
│   └── migration.sql
└── migration_lock.toml
```

---

## Detailed Migration Logs

### Migration 1: `20261110045801_create_category`
- **Applied At:** Initial Setup
- **Tables Affected:** `Category`
- **Purpose:** Creates the category table for organizing store catalog products.
- **SQL Generated:**
  ```sql
  CREATE TABLE "Category" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "image" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,

      CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
  );

  CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
  ```
- **Verification:** Table `Category` exists in PostgreSQL with unique index on `slug`.

---

### Migration 2: `20261110050757_create_product`
- **Applied At:** Catalog Setup
- **Tables Affected:** `Product`
- **Purpose:** Creates the product inventory table with decimal pricing and foreign key relation to `Category`.
- **SQL Generated:**
  ```sql
  CREATE TABLE "Product" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "price" DECIMAL(10,2) NOT NULL,
      "image" TEXT,
      "stock" INTEGER NOT NULL DEFAULT 0,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "categoryId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,

      CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
  );

  ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") 
      ON DELETE RESTRICT ON UPDATE CASCADE;
  ```
- **Verification:** Table `Product` exists with foreign key constraint `Product_categoryId_fkey` linked to `Category(id)`.

---

### Migration 3: `20261110112253_create_user_masters`
- **Applied At:** User Masters Implementation
- **Tables Affected:** `user_masters`
- **Purpose:** Creates the unified user masters table accommodating Members, Sellers, Employees, and Nest Experts. Adds unique indexes on `email`, `phoneNumber`, `referralCode`, and `sellerId`.
- **Command Executed:**
  ```powershell
  npx prisma migrate dev --name create_user_masters --config prisma7.config.ts
  ```
- **SQL Generated:**
  ```sql
  CREATE TABLE "user_masters" (
      "userId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phoneNumber" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "fcmToken" TEXT,
      "referralCode" TEXT NOT NULL,
      "referredByCode" TEXT,
      "isHaatzaEmployee" BOOLEAN NOT NULL DEFAULT false,
      "isSeller" BOOLEAN NOT NULL DEFAULT false,
      "status" BOOLEAN NOT NULL DEFAULT true,
      "isNestExpert" BOOLEAN NOT NULL DEFAULT false,
      "isReseller" BOOLEAN NOT NULL DEFAULT false,
      "sellerId" TEXT,
      "sellerAddress1" TEXT,
      "sellerAddress2" TEXT,
      "city" TEXT,
      "state" TEXT,
      "country" TEXT,
      "pinCode" TEXT,
      "sellerPickupAddress" TEXT,
      "pickupLocationId" TEXT,
      "sellerOnboardedAt" TIMESTAMP(3),
      "latitude" DECIMAL(10,8),
      "longitude" DECIMAL(11,8),
      "bankName" TEXT,
      "accountHolderName" TEXT,
      "accountNumber" TEXT,
      "ifscCode" TEXT,
      "accountManager" TEXT,
      "gstin" TEXT,
      "companyName" TEXT,
      "panNumber" TEXT,
      "isGSTRegistered" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,

      CONSTRAINT "user_masters_pkey" PRIMARY KEY ("userId")
  );

  CREATE UNIQUE INDEX "user_masters_email_key" ON "user_masters"("email");
  CREATE UNIQUE INDEX "user_masters_phoneNumber_key" ON "user_masters"("phoneNumber");
  CREATE UNIQUE INDEX "user_masters_referralCode_key" ON "user_masters"("referralCode");
  CREATE UNIQUE INDEX "user_masters_sellerId_key" ON "user_masters"("sellerId");
  ```
- **Verification:** Table `user_masters` is present and up to date in PostgreSQL `haatza_backend`. Verified via query:
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  -- Result: Category, Product, _prisma_migrations, user_masters
  ```

---

## Migration Best Practices for Future Developers

1. **Never edit applied migration files:** Editing files inside `prisma/migrations` causes Prisma checksum divergence errors.
2. **Apply migrations in development:** Always run `npx prisma migrate dev --name <migration_name> --config prisma7.config.ts`.
3. **Deploy migrations in production / CI/CD:** Run `npx prisma migrate deploy --config prisma7.config.ts`.
4. **Regenerate client after every migration:** Run `npx prisma generate --config prisma7.config.ts`.

