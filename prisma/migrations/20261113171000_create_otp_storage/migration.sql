-- CreateTable
CREATE TABLE IF NOT EXISTS "otp_storage" (
    "id" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "otp_hash" VARCHAR(128) NOT NULL,
    "otp_code" VARCHAR(6),
    "purpose" VARCHAR(50) NOT NULL DEFAULT 'login',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_storage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "otp_storage_phone_number_idx" ON "otp_storage"("phone_number");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "otp_storage_phone_number_purpose_idx" ON "otp_storage"("phone_number", "purpose");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "otp_storage_expires_at_idx" ON "otp_storage"("expires_at");

