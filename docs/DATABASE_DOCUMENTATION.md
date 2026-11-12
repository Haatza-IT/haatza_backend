# Haatza Backend - Database Documentation (`user_masters`)

**Database Engine:** PostgreSQL 16+  
**Database Name:** `haatza_backend`  
**ORM:** Prisma ORM 7.10.1 (`@prisma/adapter-pg`)  
**Table Name:** `user_masters` (Prisma Model: `UserMaster`)  

---

## 1. Overview and Architecture

The Haatza platform uses a **single unified table** named `user_masters` to store all user types:
1. **Members (Customers):** Regular buyers using the marketplace.
2. **Sellers (Merchants):** Commercial sellers with business, tax, and banking details.
3. **Employees:** Internal staff managing operations.
4. **Nest Experts:** Certified consultants and review specialists.
5. **Resellers:** Affiliate distributors.

Having a single table avoids complex multi-table joins, simplifies authentication, and allows a single person to transition smoothly from an ordinary customer to a seller or employee without duplicating identity records.

---

## 2. Complete Field-by-Field Reference

### A. Basic User Fields

| Field Name | PostgreSQL Type | Prisma Type | Required / Nullable | Default Value | Auto Generated? | Validation Rules | Purpose & Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`userId`** | `TEXT` | `String` | Required (`PRIMARY KEY`) | `uuid()` | Yes (UUIDv4) | Standard RFC 4122 UUID format | Unique primary key identifying the user across the entire platform. Generated automatically at signup. Cannot be supplied by public clients. |
| **`name`** | `TEXT` | `String` | Required | None | No | Min 1 character, trimmed | Full name of the user or contact person. |
| **`email`** | `TEXT` | `String` | Required (`UNIQUE`) | None | No | Valid email format, lowercase normalized, trimmed | Unique login and communication email. Duplicates return HTTP 409. |
| **`phoneNumber`** | `TEXT` | `String` | Required (`UNIQUE`) | None | No | Valid 10-digit Indian phone (starts 6-9), supports +91/0 prefix | Primary mobile contact. Normalized to 10 digits. Duplicates return HTTP 409. |
| **`password`** | `TEXT` | `String` | Required | None | No | Bcrypt salted hash (min 6 chars before hashing) | Stores the salted bcrypt password hash. Plaintext is never stored, logged, or returned. |
| **`fcmToken`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | Firebase Cloud Messaging device token used for mobile and web push notifications. |
| **`referralCode`** | `TEXT` | `String` | Required (`UNIQUE`) | None | Yes | `HZ` + 6 random alphanumeric chars | Unique code issued to each user to refer friends and earn rewards. Auto-generated on registration. |
| **`referredByCode`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | Alphanumeric string | Stores the referral code of the user who referred this new member. |
| **`isHaatzaEmployee`**| `BOOLEAN` | `Boolean` | Required | `false` | No | Boolean | Flag indicating internal staff status. Can only be updated via the admin-protected `/api/haatza_employee` API. |
| **`isSeller`** | `BOOLEAN` | `Boolean` | Required | `false` | Set true in seller API | Boolean | Set to `true` when a user registers as or becomes an onboarded merchant. |
| **`status`** | `BOOLEAN` | `Boolean` | Required | `true` | No | Boolean | Account status: `true` for active, `false` for suspended or deactivated. |
| **`isNestExpert`** | `BOOLEAN` | `Boolean` | Required | `false` | No | Boolean | Flag indicating verified Nest Expert status. Can only be updated via admin-protected `/api/haatza_nest_experts` API. |
| **`isReseller`** | `BOOLEAN` | `Boolean` | Required | `false` | No | Boolean | Flag reserved for reseller affiliate programs. Defaults to `false`. |

---

### B. Seller Information Fields

| Field Name | PostgreSQL Type | Prisma Type | Required / Nullable | Default Value | Auto Generated? | Validation Rules | Purpose & Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`sellerId`** | `TEXT` | `String?` | Optional (`UNIQUE`) | `NULL` | Yes (for sellers) | Format: `HSL-` + 8 hex chars | Unique business identifier assigned automatically when a user onboards as a seller. |
| **`sellerAddress1`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String, trimmed | Building number, street name, or suite. |
| **`sellerAddress2`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String, trimmed | Landmark, area, or locality. |
| **`city`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | City or town. |
| **`state`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | State or Union Territory. |
| **`country`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String (e.g., India) | Country of operation. |
| **`pinCode`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | Exactly 6 numeric digits | Indian Postal Index Number. Stored as String to preserve leading zeros. |
| **`sellerPickupAddress`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | Multiline text | Detailed warehouse address for courier logistics and package pickups. Uses PostgreSQL `TEXT`. |
| **`pickupLocationId`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | Integration ID with shipping carriers (e.g. Shiprocket, Delhivery). |
| **`sellerOnboardedAt`** | `TIMESTAMP(3)` | `DateTime?` | Optional (`NULL`) | `NULL` | Set at onboarding | UTC DateTime | Records the timestamp when merchant registration completed successfully. |

---

### C. Location Fields

| Field Name | PostgreSQL Type | Prisma Type | Required / Nullable | Default Value | Auto Generated? | Validation Rules | Purpose & Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`latitude`** | `DECIMAL(10,8)` | `Decimal?` | Optional (`NULL`) | `NULL` | No | Between -90 and 90 | Geo-coordinate for mapping merchant storefronts and calculating delivery distance. |
| **`longitude`** | `DECIMAL(11,8)` | `Decimal?` | Optional (`NULL`) | `NULL` | No | Between -180 and 180 | Geo-coordinate longitude. |

---

### D. Banking Fields

| Field Name | PostgreSQL Type | Prisma Type | Required / Nullable | Default Value | Auto Generated? | Validation Rules | Purpose & Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`bankName`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | Name of the settlement bank (e.g. HDFC Bank, SBI). |
| **`accountHolderName`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | Name of the account holder as recorded in bank records. |
| **`accountNumber`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | 9 to 18 numeric digits | Bank account number. Stored strictly as String to preserve leading zeros. Masked in responses. |
| **`ifscCode`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | 11 chars: 4 uppercase letters, '0', 6 alphanumeric chars | Indian Financial System Code for NEFT/RTGS transfers. |
| **`accountManager`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | Dedicated Haatza account manager assigned to merchant. |

---

### E. Business and Tax Fields

| Field Name | PostgreSQL Type | Prisma Type | Required / Nullable | Default Value | Auto Generated? | Validation Rules | Purpose & Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`gstin`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | 15 chars, valid state code, embedded PAN, Mod-36 checksum | Indian Goods and Services Tax Identification Number. Mandatory if `isGSTRegistered = true`. |
| **`companyName`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | String | Trade name or legal entity name of the seller business. |
| **`panNumber`** | `TEXT` | `String?` | Optional (`NULL`) | `NULL` | No | Exactly 10 chars: `[A-Z]{5}[0-9]{4}[A-Z]{1}` | Permanent Account Number for Indian Income Tax compliance. |
| **`isGSTRegistered`** | `BOOLEAN` | `Boolean` | Required | `false` | No | Boolean | Indicates whether the seller has GST registration. If true, `gstin` is strictly required. |

---

### F. Timestamp Fields

| Field Name | PostgreSQL Type | Prisma Type | Required / Nullable | Default Value | Auto Generated? | Validation Rules | Purpose & Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`createdAt`** | `TIMESTAMP(3)` | `DateTime` | Required | `CURRENT_TIMESTAMP` | Yes | Valid ISO 8601 UTC timestamp | Record creation timestamp. |
| **`updatedAt`** | `TIMESTAMP(3)` | `DateTime` | Required | Handled by Prisma (`@updatedAt`) | Yes | Valid ISO 8601 UTC timestamp | Automatically updated by Prisma whenever any field in the record is modified. |

---

## 3. Database Constraints, Indexes, and Relations

### Primary Key
- `CONSTRAINT "user_masters_pkey" PRIMARY KEY ("userId")`
- Uses UUIDv4 strings.

### Unique Indexes
Unique constraints automatically generate PostgreSQL B-tree unique indexes:
1. `user_masters_email_key`: `CREATE UNIQUE INDEX "user_masters_email_key" ON "user_masters"("email");`
   - Guarantees no two users share an email address.
2. `user_masters_phoneNumber_key`: `CREATE UNIQUE INDEX "user_masters_phoneNumber_key" ON "user_masters"("phoneNumber");`
   - Guarantees unique mobile numbers across the platform.
3. `user_masters_referralCode_key`: `CREATE UNIQUE INDEX "user_masters_referralCode_key" ON "user_masters"("referralCode");`
   - Guarantees referral tracking uniqueness.
4. `user_masters_sellerId_key`: `CREATE UNIQUE INDEX "user_masters_sellerId_key" ON "user_masters"("sellerId");`
   - Guarantees unique merchant IDs. Note: In PostgreSQL, `UNIQUE` allows multiple `NULL` values for non-sellers while enforcing uniqueness on all non-null values.

### Existing Catalog Models (Preserved)
- **`Category` (`Category` table):** Contains `id`, `name`, `slug` (Unique), `image`, `isActive`, `createdAt`, `updatedAt`.
- **`Product` (`Product` table):** Contains `id`, `name`, `description`, `price`, `image`, `stock`, `isActive`, `categoryId`, `createdAt`, `updatedAt`.
- **Foreign Key:** `Product.categoryId` references `Category.id` (`ON DELETE RESTRICT ON UPDATE CASCADE`).

