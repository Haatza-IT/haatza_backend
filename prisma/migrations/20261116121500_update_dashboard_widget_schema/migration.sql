-- Drop existing dashboard table and recreate with exact 18-column widget configuration structure
DROP TABLE IF EXISTS "dashboard" CASCADE;

-- CreateTable
CREATE TABLE "dashboard" (
    "widget_id" TEXT NOT NULL,
    "widget_name" TEXT NOT NULL,
    "widget_redirect_to" TEXT,
    "placement" TEXT,
    "sequence" INTEGER,
    "territory" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "product_id" TEXT,
    "category_id" TEXT,
    "warehouse_id" TEXT,
    "redirect_category_id" TEXT,
    "redirect_product_id" TEXT,
    "effective_from" TIMESTAMPTZ,
    "effective_to" TIMESTAMPTZ,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "module" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_pkey" PRIMARY KEY ("widget_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_widget_id_key" ON "dashboard"("widget_id");

-- CreateIndex
CREATE INDEX "dashboard_placement_sequence_idx" ON "dashboard"("placement", "sequence");

-- CreateIndex
CREATE INDEX "dashboard_module_status_idx" ON "dashboard"("module", "status");

-- CreateIndex
CREATE INDEX "dashboard_territory_idx" ON "dashboard"("territory");

-- CreateIndex
CREATE INDEX "dashboard_warehouse_id_idx" ON "dashboard"("warehouse_id");

-- CreateIndex
CREATE INDEX "dashboard_effective_dates_idx" ON "dashboard"("effective_from", "effective_to");

-- CreateIndex for JSONB items search
CREATE INDEX "dashboard_items_gin_idx" ON "dashboard" USING GIN ("items");

