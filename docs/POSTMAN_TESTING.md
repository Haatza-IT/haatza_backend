# Haatza Backend - Postman Testing Guide

This guide provides instructions and examples for testing the four Haatza User Master endpoints using Postman.

A ready-to-import Postman Collection is also available at the root of the project:  
`haatza_user_masters_postman_collection.json`

---

## 1. Prerequisites & Environment Setup

1. **Start the backend development server:**
   ```powershell
   npm run dev
   ```
2. **Base URL:** `http://localhost:3000`
3. **Admin API Key:** `haatza_admin_secret_key_2026` (or the value set in `ADMIN_API_KEY` in `.env`).

---

## 2. Test Suite 1: Haatza Member Registration (`POST /api/haatza_members`)

### Test 1.1: Successful Member Registration (Expected: `201 Created`)
- **URL:** `{{baseUrl}}/api/haatza_members`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phoneNumber": "9876543210",
    "passcode": "Haatza@2026",
    "status": true,
    "referral": "",
    "fcmToken": "fcm_token_sample_device_1"
  }
  ```
- **Assertions:**
  - Status code is `201`.
  - `data.userId` is a valid UUID.
  - `data.referralCode` starts with `"HZ"`.
  - `data.password` is **undefined** (never returned).
  - Copy `data.userId` for employee/expert tests below.

### Test 1.2: Duplicate Email Conflict (Expected: `409 Conflict`)
- **Body:** Send the exact same body as Test 1.1.
- **Expected Response:**
  ```json
  {
    "success": false,
    "message": "Email already exists",
    "errors": [{ "field": "email", "message": "Email already exists" }]
  }
  ```

### Test 1.3: Duplicate Phone Number Conflict (Expected: `409 Conflict`)
- **Body:** Change email to `"another.email@example.com"`, but keep `phoneNumber: "9876543210"`.
- **Expected Response:**
  ```json
  {
    "success": false,
    "message": "Phone number already exists",
    "errors": [{ "field": "phoneNumber", "message": "Phone number already exists" }]
  }
  ```

### Test 1.4: Invalid Email Format (Expected: `400 Bad Request`)
- **Body:**
  ```json
  {
    "name": "Invalid Email",
    "email": "not-an-email-address",
    "phoneNumber": "9812345678",
    "passcode": "Test@12345"
  }
  ```
- **Expected Response:** HTTP 400 with `errors[0].field == "email"`.

### Test 1.5: Invalid Indian Phone Number (Expected: `400 Bad Request`)
- **Body:**
  ```json
  {
    "name": "Invalid Phone",
    "email": "valid.mail@example.com",
    "phoneNumber": "12345",
    "passcode": "Test@12345"
  }
  ```
- **Expected Response:** HTTP 400 with `errors[0].field == "phoneNumber"`.

---

## 3. Test Suite 2: Haatza Seller Registration (`POST /api/haatza_seller`)

### Test 2.1: Successful Seller Onboarding (Expected: `201 Created`)
- **URL:** `{{baseUrl}}/api/haatza_seller`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Priya Enterprises",
    "email": "priya.seller@example.com",
    "phoneNumber": "9811122233",
    "passcode": "SellerPass@2026",
    "fcmToken": "seller_device_token_xyz",
    "referral": "",
    "sellerAddress1": "Plot 45, MIDC Industrial Area",
    "sellerAddress2": "Near Central Bank",
    "city": "Pune",
    "state": "Maharashtra",
    "country": "India",
    "pinCode": "411001",
    "sellerPickupAddress": "Plot 45, Gate 2, MIDC, Pune, Maharashtra 411001",
    "pickupLocationId": "LOC-PUNE-01",
    "latitude": 18.5204,
    "longitude": 73.8567,
    "bankName": "State Bank of India",
    "accountHolderName": "Priya Enterprises",
    "accountNumber": "00012345678901",
    "ifscCode": "SBIN0000300",
    "accountManager": "Vikram Seth",
    "gstin": "27AAPFU0939F1ZV",
    "companyName": "Priya Enterprises Pvt Ltd",
    "panNumber": "AAPFU0939F",
    "isGSTRegistered": true
  }
  ```
- **Assertions:**
  - Status is `201`.
  - `data.sellerId` starts with `"HSL-"`.
  - `data.isSeller` is `true`.
  - `data.accountNumber` is masked (`XXXXXXXXXX8901`).
  - `data.sellerOnboardedAt` is a valid UTC timestamp.

### Test 2.2: Invalid GSTIN Checksum (Expected: `400 Bad Request`)
- **Body:** Use `gstin: "27AAPFU0939F1Z0"` (last character altered).
- **Expected Response:** HTTP 400 error indicating GSTIN checksum failure.

### Test 2.3: GST Registered without GSTIN (Expected: `400 Bad Request`)
- **Body:** Set `"isGSTRegistered": true` and omit or send `"gstin": ""`.
- **Expected Response:** HTTP 400: `"GSTIN is required when registered under GST"`.

### Test 2.4: Invalid PIN Code (Expected: `400 Bad Request`)
- **Body:** Set `"pinCode": "4110"` (not 6 digits).
- **Expected Response:** HTTP 400: `"PIN code must contain exactly six numeric digits."`.

### Test 2.5: Invalid Coordinates (Expected: `400 Bad Request`)
- **Body:** Set `"latitude": 95.0` (out of range).
- **Expected Response:** HTTP 400: `"Latitude must be between -90 and 90"`.

---

## 4. Test Suite 3: Haatza Employee Role Assignment (`POST /api/haatza_employee`)

### Test 3.1: Missing Admin Authorization (Expected: `401 Unauthorized`)
- **URL:** `{{baseUrl}}/api/haatza_employee`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json` *(Do NOT include admin key)*
- **Body:**
  ```json
  {
    "isHaatzaEmployee": true,
    "userId": "<EXISTING_USER_ID>"
  }
  ```
- **Expected Response:** HTTP 401: `"Authentication required: Admin API key is missing."`.

### Test 3.2: Invalid Admin Authorization (Expected: `403 Forbidden`)
- **Headers:**
  ```http
  Content-Type: application/json
  x-admin-key: wrong_secret_key
  ```
- **Expected Response:** HTTP 403: `"Forbidden: Insufficient permissions"`.

### Test 3.3: Nonexistent User ID (Expected: `404 Not Found`)
- **Headers:**
  ```http
  Content-Type: application/json
  x-admin-key: haatza_admin_secret_key_2026
  ```
- **Body:**
  ```json
  {
    "isHaatzaEmployee": true,
    "userId": "00000000-0000-0000-0000-000000000000"
  }
  ```
- **Expected Response:** HTTP 404: `"User not found with the specified userId"`.

### Test 3.4: Successful Employee Promotion (Expected: `200 OK`)
- **Headers:**
  ```http
  Content-Type: application/json
  x-admin-key: haatza_admin_secret_key_2026
  ```
- **Body:**
  ```json
  {
    "isHaatzaEmployee": true,
    "userId": "<COPIED_USER_ID_FROM_TEST_1.1>"
  }
  ```
- **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Haatza employee status updated successfully",
    "data": {
      "userId": "<SAME_USER_ID>",
      "isHaatzaEmployee": true
    }
  }
  ```

---

## 5. Test Suite 4: Haatza Nest Expert Role Assignment (`POST /api/haatza_nest_experts`)

### Test 4.1: Missing Admin Authorization (Expected: `401 Unauthorized`)
- **URL:** `{{baseUrl}}/api/haatza_nest_experts`
- **Headers:** `Content-Type: application/json`
- **Body:** `{ "isNestExpert": true, "userId": "<EXISTING_USER_ID>" }`
- **Expected Response:** HTTP 401.

### Test 4.2: Successful Nest Expert Promotion (Expected: `200 OK`)
- **Headers:**
  ```http
  Content-Type: application/json
  x-admin-key: haatza_admin_secret_key_2026
  ```
- **Body:**
  ```json
  {
    "isNestExpert": true,
    "userId": "<COPIED_USER_ID_FROM_TEST_1.1>"
  }
  ```
- **Expected Response:**
  ```json
  {
    "success": true,
    "message": "Haatza Nest Expert status updated successfully",
    "data": {
      "userId": "<SAME_USER_ID>",
      "isNestExpert": true
    }
  }
  ```

