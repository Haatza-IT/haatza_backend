-- CreateTable
CREATE TABLE IF NOT EXISTS "dashboard" (
    "Widget_id" TEXT NOT NULL,
    "Widget_name" TEXT NOT NULL,
    "Redirected_to" TEXT,
    "Placement" TEXT,
    "Sequence" INTEGER,
    "Territory" TEXT,
    "Items" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "Product_Id" TEXT,
    "Category_Id" TEXT,

    CONSTRAINT "dashboard_pkey" PRIMARY KEY ("Widget_id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "dashboard_Widget_id_key" ON "dashboard"("Widget_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "dashboard_Placement_idx" ON "dashboard"("Placement");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "dashboard_Territory_idx" ON "dashboard"("Territory");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "dashboard_Sequence_idx" ON "dashboard"("Sequence");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "dashboard_Product_Id_idx" ON "dashboard"("Product_Id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "dashboard_Category_Id_idx" ON "dashboard"("Category_Id");
