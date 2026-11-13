-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "activeAd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "averageCpc" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "businessRegistrationType" TEXT,
ADD COLUMN     "businessState" TEXT,
ADD COLUMN     "businessStateCode" TEXT,
ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "categoryName" TEXT,
ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "codPrice" INTEGER,
ADD COLUMN     "deliveryCharges" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "discount" INTEGER DEFAULT 0,
ADD COLUMN     "gstNo" TEXT,
ADD COLUMN     "haatzaVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "impression" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "influencerBranding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDomestic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isGstSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isHaatzaLite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSellerEarn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manageVariants" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mrp" INTEGER,
ADD COLUMN     "onSalePrice" INTEGER,
ADD COLUMN     "panNumber" TEXT,
ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "priorityScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productCoverImages" JSONB,
ADD COLUMN     "productHighlights" JSONB,
ADD COLUMN     "productOptions" JSONB,
ADD COLUMN     "productSpecification" JSONB,
ADD COLUMN     "productType" TEXT,
ADD COLUMN     "promotionalImages" JSONB,
ADD COLUMN     "reach" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "returnPolicy" JSONB,
ADD COLUMN     "revenue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ribbon" TEXT,
ADD COLUMN     "sales" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "salesTerritoryType" TEXT,
ADD COLUMN     "searchKeyword" JSONB,
ADD COLUMN     "sellAndEarnCommission" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sellerId" TEXT,
ADD COLUMN     "sellerPincode" TEXT,
ADD COLUMN     "shippingWeight" INTEGER,
ADD COLUMN     "similarCategoryId" TEXT,
ADD COLUMN     "sizeChart" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "subcategoryId" TEXT,
ADD COLUMN     "subcategoryName" TEXT,
ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "upi" INTEGER,
ADD COLUMN     "upiPaymentDiscount" INTEGER,
ADD COLUMN     "variantPrice" JSONB,
ADD COLUMN     "warehouseId" TEXT,
ADD COLUMN     "warehousePincode" TEXT,
ALTER COLUMN "price" SET DATA TYPE INTEGER USING ROUND("price")::integer;

-- CreateIndex
CREATE INDEX "Product_sellerId_idx" ON "Product"("sellerId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_subcategoryId_idx" ON "Product"("subcategoryId");

-- CreateIndex
CREATE INDEX "Product_campaignId_idx" ON "Product"("campaignId");

-- CreateIndex
CREATE INDEX "Product_warehouseId_idx" ON "Product"("warehouseId");

-- CreateIndex
CREATE INDEX "Product_sku_idx" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_similarCategoryId_fkey" FOREIGN KEY ("similarCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user_masters"("sellerId") ON DELETE SET NULL ON UPDATE CASCADE;

