# Haatza Backend - Complete API Documentation

This document covers the four core User Master HTTP POST registration and role management APIs in the Haatza backend.

---

## Standard API Response Format

All APIs adhere to a standardized JSON envelope:

### Success Response Envelope
```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": { ... }
}
```

### Error Response Envelope
```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific reason for validation failure"
    }
  ]
}
```

### HTTP Status Code Conventions
- `201 Created`: Member or Seller successfully registered.
- `200 OK`: Role status (Employee or Nest Expert) successfully updated.
- `400 Bad Request`: Validation failure or malformed JSON payload.
- `401 Unauthorized`: Missing administrator credentials on privileged routes.
- `403 Forbidden`: Invalid administrator credentials on privileged routes.
- `404 Not Found`: Target user does not exist in the database.
- `409 Conflict`: Unique constraint violation (email, phone, or referral code conflict).
- `500 Internal Server Error`: Unexpected server exception.

---

## API 1: Register Haatza Member

- **Endpoint:** `/api/haatza_members`
- **HTTP Method:** `POST`
- **Route File:** `app/api/haatza_members/route.ts`
- **Service Layer:** `UserMasterService.registerMember` (`modules/user-master/user-master.service.ts`)
- **Repository Layer:** `UserMasterRepository.createMember` (`modules/user-master/user-master.repository.ts`)
- **Access Level:** Public

### Purpose
Registers an ordinary Haatza consumer/shopper. Automatically creates a unique UUID `userId`, securely hashes the passcode with bcrypt, generates a unique referral code with `HZ` prefix, and sets default shopper privileges.

### Request Headers
```http
Content-Type: application/json
```

### Request Body Schema
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Full customer name (min 1 char). |
| `email` | String | Yes | Valid email. Auto-normalized to lowercase. |
| `phoneNumber`| String | Yes | 10-digit Indian phone (supports +91/91/0 prefix). |
| `passcode` | String | Yes | Plaintext password (min 6 characters). Hashed before saving. |
| `status` | Boolean | No | Account status. Defaults to `true`. |
| `referral` | String | No | Referral code of the friend who invited them. Stored in `referredByCode`. |
| `fcmToken` | String | No | Push notification device token. |

### Example Request Body
```json
{
  "name": "Test Member",
  "email": "member@example.com",
  "phoneNumber": "9876543210",
  "passcode": "Test@12345",
  "status": true,
  "referral": "HZ9M2P5R",
  "fcmToken": "sample-fcm-token"
}
```

### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Haatza member registered successfully",
  "data": {
    "userId": "e4a2c1d3-9876-4321-bbbb-123456789abc",
    "name": "Test Member",
    "email": "member@example.com",
    "phoneNumber": "9876543210",
    "fcmToken": "sample-fcm-token",
    "referralCode": "HZX8K2N4",
    "referredByCode": "HZ9M2P5R",
    "isHaatzaEmployee": false,
    "isSeller": false,
    "status": true,
    "isNestExpert": false,
    "isReseller": false,
    "sellerId": null,
    "sellerAddress1": null,
    "sellerAddress2": null,
    "city": null,
    "state": null,
    "country": null,
    "pinCode": null,
    "sellerPickupAddress": null,
    "pickupLocationId": null,
    "sellerOnboardedAt": null,
    "latitude": null,
    "longitude": null,
    "bankName": null,
    "accountHolderName": null,
    "accountNumber": null,
    "ifscCode": null,
    "accountManager": null,
    "gstin": null,
    "companyName": null,
    "panNumber": null,
    "isGSTRegistered": false,
    "createdAt": "2026-11-10T11:45:00.000Z",
    "updatedAt": "2026-11-10T11:45:00.000Z"
  }
}
```

### Common Error Scenarios
1. **Duplicate Email (`409 Conflict`):**
   ```json
   {
     "success": false,
     "message": "Email already exists",
     "errors": [{ "field": "email", "message": "Email already exists" }]
   }
   ```
2. **Invalid Phone Number (`400 Bad Request`):**
   ```json
   {
     "success": false,
     "message": "Validation failed",
     "errors": [{ "field": "phoneNumber", "message": "Invalid phone number. Must be a valid 10-digit Indian phone number starting with 6-9." }]
   }
   ```

---

## API 2: Register Haatza Seller

- **Endpoint:** `/api/haatza_seller`
- **HTTP Method:** `POST`
- **Route File:** `app/api/haatza_seller/route.ts`
- **Service Layer:** `UserMasterService.registerSeller` (`modules/user-master/user-master.service.ts`)
- **Repository Layer:** `UserMasterRepository.createSeller` (`modules/user-master/user-master.repository.ts`)
- **Access Level:** Public

### Purpose
Registers an e-commerce merchant/seller. Gathers user identity, pickup logistics addresses, geographic coordinates, settlement bank details, and business tax IDs (PAN & GSTIN). Enforces official Mod-36 checksum calculation on GSTIN and masks bank account numbers in responses.

### Request Headers
```http
Content-Type: application/json
```

### Request Body Schema
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Merchant or business owner's contact name. |
| `email` | String | Yes | Unique login email. |
| `phoneNumber` | String | Yes | 10-digit Indian mobile number. |
| `passcode` | String | Yes | Password to be hashed. |
| `fcmToken` | String | No | Notification token. |
| `referral` | String | No | Inviter's referral code. |
| `sellerAddress1` | String | No | Primary physical storefront/office address. |
| `sellerAddress2` | String | No | Locality/landmark. |
| `city` | String | No | City. |
| `state` | String | No | State or UT. |
| `country` | String | No | Country. |
| `pinCode` | String | No | Exactly 6 numeric digits. |
| `sellerPickupAddress`| String | No | Full logistics pickup address. |
| `pickupLocationId` | String | No | Courier carrier location code. |
| `latitude` | Number | No | Range: -90.0 to 90.0. |
| `longitude` | Number | No | Range: -180.0 to 180.0. |
| `bankName` | String | No | Commercial bank name. |
| `accountHolderName` | String | No | Beneficiary name. |
| `accountNumber` | String | No | 9 to 18 numeric digits (String). |
| `ifscCode` | String | No | 11-char uppercase IFSC (`[A-Z]{4}0[A-Z0-9]{6}`). |
| `accountManager` | String | No | Dedicated representative name. |
| `companyName` | String | No | Legal business or firm name. |
| `panNumber` | String | No | 10-char PAN (`[A-Z]{5}[0-9]{4}[A-Z]{1}`). |
| `isGSTRegistered` | Boolean| No | Defaults to `false`. |
| `gstin` | String | Cond. | Mandatory if `isGSTRegistered = true`. Validated with Mod-36 algorithm. |

### Example Request Body
```json
{
  "name": "Test Seller",
  "email": "seller@example.com",
  "phoneNumber": "9876501234",
  "passcode": "Seller@12345",
  "fcmToken": "seller-fcm-token",
  "referral": "",
  "sellerAddress1": "Shop 12, Ground Floor",
  "sellerAddress2": "Market Complex",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "pinCode": "400001",
  "sellerPickupAddress": "Warehouse 4, Logistics Park, Mumbai, Maharashtra 400001",
  "pickupLocationId": "LOC-MUM-01",
  "latitude": 18.9220,
  "longitude": 72.8346,
  "bankName": "HDFC Bank",
  "accountHolderName": "Test Seller Ventures",
  "accountNumber": "50100123456789",
  "ifscCode": "HDFC0000060",
  "accountManager": "Rajesh Kumar",
  "gstin": "27AAPFU0939F1ZV",
  "companyName": "Haatza Merchant LLP",
  "panNumber": "AAPFU0939F",
  "isGSTRegistered": true
}
```

### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Haatza seller registered successfully",
  "data": {
    "userId": "b96a9282-e300-4824-a714-3a9ec6ffc9e5",
    "sellerId": "HSL-A1B2C3D4",
    "name": "Test Seller",
    "email": "seller@example.com",
    "phoneNumber": "9876501234",
    "referralCode": "HZ8K2N9P",
    "isSeller": true,
    "sellerOnboardedAt": "2026-11-10T11:50:00.000Z",
    "accountNumber": "XXXXXXXXXX6789",
    "bankName": "HDFC Bank",
    "gstin": "27AAPFU0939F1ZV",
    "companyName": "Haatza Merchant LLP",
    "isGSTRegistered": true,
    "status": true,
    "createdAt": "2026-11-10T11:50:00.000Z",
    "updatedAt": "2026-11-10T11:50:00.000Z"
  }
}
```

### Common Error Scenarios
1. **Invalid GSTIN Checksum (`400 Bad Request`):**
   ```json
   {
     "success": false,
     "message": "Validation failed",
     "errors": [{ "field": "gstin", "message": "Invalid GSTIN format, state code, embedded PAN, or checksum character." }]
   }
   ```
2. **Missing GSTIN when GST Registered (`400 Bad Request`):**
   ```json
   {
     "success": false,
     "message": "Validation failed",
     "errors": [{ "field": "gstin", "message": "GSTIN is required when registered under GST" }]
   }
   ```

---

## API 3: Register / Update Haatza Employee

- **Endpoint:** `/api/haatza_employee`
- **HTTP Method:** `POST`
- **Route File:** `app/api/haatza_employee/route.ts`
- **Service Layer:** `UserMasterService.updateEmployeeStatus` (`modules/user-master/user-master.service.ts`)
- **Repository Layer:** `UserMasterRepository.updateEmployeeRole` (`modules/user-master/user-master.repository.ts`)
- **Access Level:** Protected (Administrator Only)

### Purpose
Promotes or demotes an existing registered user to internal employee status. It requires an existing `userId`; it does not generate a second user record. It is secured with an admin authorization key.

### Request Headers
```http
Content-Type: application/json
x-admin-key: haatza_admin_secret_key_2026
```
*(Alternatively, `Authorization: Bearer haatza_admin_secret_key_2026` is accepted)*

### Request Body Schema
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | String | Yes | Auto-generated UUID of the existing user. |
| `isHaatzaEmployee` | Boolean | Yes | `true` to grant employee privileges, `false` to revoke. |

### Example Request Body
```json
{
  "isHaatzaEmployee": true,
  "userId": "e4a2c1d3-9876-4321-bbbb-123456789abc"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Haatza employee status updated successfully",
  "data": {
    "userId": "e4a2c1d3-9876-4321-bbbb-123456789abc",
    "name": "Test Member",
    "email": "member@example.com",
    "isHaatzaEmployee": true,
    "status": true,
    "updatedAt": "2026-11-10T11:55:00.000Z"
  }
}
```

### Common Error Scenarios
1. **Missing Admin Authorization Header (`401 Unauthorized`):**
   ```json
   {
     "success": false,
     "message": "Authentication required: Admin API key is missing. Provide x-admin-key or Authorization Bearer header.",
     "errors": []
   }
   ```
2. **Invalid Admin Authorization Key (`403 Forbidden`):**
   ```json
   {
     "success": false,
     "message": "Forbidden: Insufficient permissions",
     "errors": []
   }
   ```
3. **User Not Found (`404 Not Found`):**
   ```json
   {
     "success": false,
     "message": "User not found with the specified userId",
     "errors": []
   }
   ```

---

## API 4: Register / Update Haatza Nest Expert

- **Endpoint:** `/api/haatza_nest_experts`
- **HTTP Method:** `POST`
- **Route File:** `app/api/haatza_nest_experts/route.ts`
- **Service Layer:** `UserMasterService.updateNestExpertStatus` (`modules/user-master/user-master.service.ts`)
- **Repository Layer:** `UserMasterRepository.updateNestExpertRole` (`modules/user-master/user-master.repository.ts`)
- **Access Level:** Protected (Administrator Only)

### Purpose
Promotes or demotes an existing registered user to verified Nest Expert consultant status. It updates the existing `userId` in `user_masters`. Protected by admin authorization.

### Request Headers
```http
Content-Type: application/json
x-admin-key: haatza_admin_secret_key_2026
```

### Request Body Schema
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | String | Yes | Auto-generated UUID of the existing user. |
| `isNestExpert` | Boolean | Yes | `true` to grant Nest Expert privileges, `false` to revoke. |

### Example Request Body
```json
{
  "isNestExpert": true,
  "userId": "e4a2c1d3-9876-4321-bbbb-123456789abc"
}
```

### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Haatza Nest Expert status updated successfully",
  "data": {
    "userId": "e4a2c1d3-9876-4321-bbbb-123456789abc",
    "name": "Test Member",
    "email": "member@example.com",
    "isNestExpert": true,
    "status": true,
    "updatedAt": "2026-11-10T11:58:00.000Z"
  }
}
```

### Common Error Scenarios
1. **Missing Admin Header (`401 Unauthorized`):**
   ```json
   {
     "success": false,
     "message": "Authentication required: Admin API key is missing. Provide x-admin-key or Authorization Bearer header.",
     "errors": []
   }
   ```
2. **Invalid Admin Key (`403 Forbidden`):**
   ```json
   {
     "success": false,
     "message": "Forbidden: Insufficient permissions",
     "errors": []
   }
   ```
3. **Nonexistent `userId` (`404 Not Found`):**
   ```json
   {
     "success": false,
     "message": "User not found with the specified userId",
     "errors": []
   }
   ```

