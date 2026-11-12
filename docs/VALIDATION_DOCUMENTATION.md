# Haatza Backend - Complete Validation Architecture

This document explains the input validation architecture implemented across the Haatza backend.

---

## 1. Validation Philosophy

1. **Fail-Fast Principle:** Invalid data is rejected immediately at the application boundary before any database or business logic is invoked.
2. **Declarative Schemas:** All request bodies are strictly validated using **Zod** schemas.
3. **Strict Keys (`.strict()`):** Reject extraneous or unexpected fields to block parameter-tampering attacks (e.g. attempting to submit `userId` or `isSeller: true` to a member endpoint).
4. **Data Normalization:** Strings such as emails, IFSC codes, PAN numbers, and GSTINs are automatically trimmed and case-normalized.

---

## 2. Reusable Primitive Validators (`validations/`)

### A. Email Validation (`validations/email.validation.ts`)
- **Schema:** `emailSchema`
- **Rules:**
  - Must be a valid string format matching RFC 5322.
  - Automatically trimmed of whitespace.
  - Automatically converted to lowercase before database query and storage.
- **Example:** `" Member@Example.COM "` -> `"member@example.com"`.

### B. Indian Phone Number Validation (`validations/phone.validation.ts`)
- **Schema:** `phoneSchema`
- **Algorithm (`normalizeAndValidatePhone`):**
  1. Strips all spaces, hyphens, and parentheses: `replace(/[\s\-()]/g, "")`.
  2. If it starts with `+91`, strips the 3 characters.
  3. If it starts with `91` and is 12 digits, strips the leading `91`.
  4. If it starts with `0` and is 11 digits, strips the leading `0`.
  5. Enforces that the remaining string is **exactly 10 digits starting with 6, 7, 8, or 9** (`/^[6-9]\d{9}$/`).
- **Examples:**
  - `"+91 98765 43210"` -> `"9876543210"` (Valid)
  - `"09876543210"` -> `"9876543210"` (Valid)
  - `"12345"` -> Rejected with HTTP 400.

### C. Indian PIN Code Validation (`validations/common.validation.ts`)
- **Schema:** `pinCodeSchema`
- **Rule:** Must be exactly six numeric digits: `/^\d{6}$/`.
- **Note:** Preserved as a `String` so leading zeros (e.g. in certain postal circles) are never truncated.

### D. Banking Validation (`validations/banking.validation.ts`)

#### 1. IFSC Code (`ifscSchema`)
- **Rule:** Exactly 11 characters.
- **Format:**
  - First 4 characters: Uppercase letters (Bank Identifier).
  - 5th character: `0` (Zero, reserved for future use).
  - Last 6 characters: Alphanumeric characters (Branch Code).
  - Regex: `/^[A-Z]{4}0[A-Z0-9]{6}$/`.
- **Example:** `HDFC0000060`, `SBIN0001234`.

#### 2. Bank Account Number (`accountNumberSchema`)
- **Rule:** Numeric string with 9 to 18 digits (`/^\d{9,18}$/`).
- **Storage:** Stored as `TEXT`/`String`, never `INTEGER` or `BIGINT`, preserving leading zeros.

### E. Tax and Business Validation (`validations/tax.validation.ts`)

#### 1. Permanent Account Number (PAN) (`panSchema`)
- **Rule:** Exactly 10 characters.
- **Format:** `[A-Z]{5}[0-9]{4}[A-Z]{1}`
  - First 5 characters: Uppercase letters.
  - Next 4 characters: Numeric digits.
  - 10th character: Uppercase letter.
- **Example:** `AAPFU0939F`.

#### 2. Goods and Services Tax Identification Number (GSTIN) (`gstinSchema`)
Indian GSTIN validation is not merely a regular expression. It implements a **four-stage verification**:
1. **Structural Length & Pattern:** 15 characters matching `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`.
   - Characters 1–2: 2-digit State Code.
   - Characters 3–12: 10-character PAN of the entity.
   - Character 13: Entity registration number for that PAN (1-9 or A-Z).
   - Character 14: Default character `Z`.
   - Character 15: Checksum digit.
2. **State Code Check:** Must match a valid Indian state or territory code (01 through 38, 97, 99).
3. **Embedded PAN Format:** Characters 3–12 are independently verified against `validatePAN`.
4. **Official Modulo-36 Luhn-like Checksum Algorithm:**
   - Base character map: `"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"` (indices 0 to 35).
   - Alternating weighting factor: starts at `1` for the 1st character, then toggles between `2` and `1` across all 14 characters.
   - For each character:
     $$\text{digitProduct} = \text{codePoint} \times \text{factor}$$
     $$\text{digitContribution} = \lfloor\frac{\text{digitProduct}}{36}\rfloor + (\text{digitProduct} \pmod{36})$$
   - Sum all contributions: $\text{sum} = \sum \text{digitContribution}$.
   - Remainder: $R = \text{sum} \pmod{36}$.
   - Expected check digit code point: $C = (36 - R) \pmod{36}$.
   - Compares calculated character against the 15th character.

### F. Geographic Coordinates (`validations/common.validation.ts`)
- **Latitude:** Between `-90.0` and `90.0`.
- **Longitude:** Between `-180.0` and `180.0`.

---

## 3. Conditional Validation (Seller Registration)

In `modules/user-master/user-master.schema.ts`, the `sellerRegistrationSchema` uses Zod's `.superRefine`:

```typescript
.superRefine((data, ctx) => {
  if (data.isGSTRegistered && !data.gstin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "GSTIN is required when registered under GST",
      path: ["gstin"],
    });
  }
});
```

- If `isGSTRegistered` is `false`, GSTIN is optional.
- If `isGSTRegistered` is `true`, GSTIN is **mandatory** and must pass all format, state code, and Mod-36 checksum checks.

