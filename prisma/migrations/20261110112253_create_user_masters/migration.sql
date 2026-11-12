-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "user_masters_email_key" ON "user_masters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_masters_phoneNumber_key" ON "user_masters"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_masters_referralCode_key" ON "user_masters"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "user_masters_sellerId_key" ON "user_masters"("sellerId");
