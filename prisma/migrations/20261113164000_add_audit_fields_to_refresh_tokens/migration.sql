-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN IF NOT EXISTS "created_by" TEXT,
ADD COLUMN IF NOT EXISTS "updated_by" TEXT;
