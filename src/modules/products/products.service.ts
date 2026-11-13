import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  ProductResponse,
  ProductListResponse,
  SerializedProduct,
} from './products.types';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Serializes a database product record into the standard response shape,
   * providing both new camelCase fields and legacy aliases (id, name, isActive).
   * Sensitive seller details are stripped.
   */
  private serializeProduct(product: any): SerializedProduct {
    return {
      // A. Product and Seller Information (1-18)
      sellerId: product.sellerId ?? null,
      categoryId: product.categoryId,
      productId: product.productId,
      id: product.productId, // Legacy alias
      productName: product.productName,
      name: product.productName, // Legacy alias
      categoryName: product.categoryName ?? (product.category?.name ?? null),
      productCoverImage: product.productCoverImage ?? null,
      productCoverImages: product.productCoverImage ? [product.productCoverImage] : [],
      productImages: product.productImages ?? [],
      sku: product.sku ?? null,
      shippingWeight: product.shippingWeight !== null && product.shippingWeight !== undefined ? Number(product.shippingWeight) : null,
      brand: product.brand ?? null,
      status: product.status,
      isActive: product.status, // Legacy alias
      productOptions: product.productOptions ?? null,
      price: product.price !== null && product.price !== undefined ? Number(product.price) : 0,
      productType: product.productType ?? null,
      discount: product.discount !== null && product.discount !== undefined ? Number(product.discount) : 0,
      manageVariants: product.manageVariants ?? false,
      ribbon: product.ribbon ?? null,
      trackInventory: product.trackInventory ?? true,
      variantPrice: product.variantPrice ?? [],

      // B. Product Specifications and Images (19-29)
      productSpecification: product.productSpecification ?? null,
      influencerBranding: product.influencerBranding ?? false,
      activeAd: product.activeAd ?? false,
      subcategoryName: product.subcategoryName ?? null,
      subcategoryId: product.subcategoryId ?? null,
      haatzaVerified: product.haatzaVerified ?? false,
      promotionalImages: product.promotionalImages ?? [],
      paymentType: product.paymentType ?? null,
      returnPolicy: product.returnPolicy ?? null,
      deliveryCharges: product.deliveryCharges ?? false,
      sizeChart: product.sizeChart ?? null,

      // C. Marketing and Analytics (30-36)
      priorityScore: product.priorityScore ?? 0,
      averageCpc: product.averageCpc !== null && product.averageCpc !== undefined ? Number(product.averageCpc) : 0,
      reach: product.reach !== null && product.reach !== undefined ? Number(product.reach) : 0,
      impression: product.impression !== null && product.impression !== undefined ? Number(product.impression) : 0,
      clicks: product.clicks !== null && product.clicks !== undefined ? Number(product.clicks) : 0,
      sales: product.sales !== null && product.sales !== undefined ? Number(product.sales) : 0,
      revenue: product.revenue !== null && product.revenue !== undefined ? Number(product.revenue) : 0,

      // D. Seller, GST and Business Information (37-48)
      sellerPincode: product.sellerPincode ?? null,
      isGstSeller: product.isGstSeller ?? false,
      searchKeyword: product.searchKeyword ?? [],
      isSellerEarn: product.isSellerEarn ?? false,
      sellAndEarnCommission: product.sellAndEarnCommission ?? 0,
      isDomestic: product.isDomestic ?? true,
      businessState: product.businessState ?? null,
      businessStateCode: product.businessStateCode ?? null,
      salesTerritoryType: product.salesTerritoryType ?? null,
      businessRegistrationType: product.businessRegistrationType ?? null,
      gstNo: product.gstNo ?? null,
      panNumber: product.panNumber ?? null,

      // E. Pricing and Payment Information (49-53)
      codPrice: product.codPrice !== null && product.codPrice !== undefined ? Number(product.codPrice) : null,
      upi: product.upi ?? null,
      mrp: product.mrp !== null && product.mrp !== undefined ? Number(product.mrp) : null,
      onSalePrice: product.onSalePrice !== null && product.onSalePrice !== undefined ? Number(product.onSalePrice) : null,
      upiPaymentDiscount: product.upiPaymentDiscount !== null && product.upiPaymentDiscount !== undefined ? Number(product.upiPaymentDiscount) : null,

      // F. Campaign, Category and Warehouse Information (54-59)
      campaignId: product.campaignId ?? null,
      similarCategoryId: product.similarCategoryId ?? null,
      productHighlights: product.productHighlights ?? [],
      isHaatzaLite: product.isHaatzaLite ?? false,
      warehouseId: product.warehouseId ?? null,
      warehousePincode: product.warehousePincode ?? null,

      // Preserved Existing Fields
      description: product.description ?? null,
      image: product.image ?? null,
      stock: product.stock ?? 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,

      // Safe Relations
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
            image: product.category.image,
          }
        : undefined,
      seller: product.seller
        ? {
            sellerId: product.seller.sellerId,
            name: product.seller.name,
            companyName: product.seller.companyName,
            city: product.seller.city,
            state: product.seller.state,
          }
        : undefined,
    };
  }

  /**
   * Creates a new product with all 59 fields and relationships.
   */
  async createProduct(dto: CreateProductDto): Promise<ProductResponse> {
    // 1. Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID '${dto.categoryId}' does not exist.`);
    }

    // 2. Verify seller exists if sellerId is supplied
    if (dto.sellerId) {
      const seller = await this.prisma.userMaster.findUnique({
        where: { sellerId: dto.sellerId },
      });
      if (!seller) {
        throw new NotFoundException(`Seller with sellerId '${dto.sellerId}' does not exist.`);
      }
    }

    // 3. Verify similarCategoryId exists if supplied
    if (dto.similarCategoryId) {
      const similarCategory = await this.prisma.category.findUnique({
        where: { id: dto.similarCategoryId },
      });
      if (!similarCategory) {
        throw new NotFoundException(`Similar Category with ID '${dto.similarCategoryId}' does not exist.`);
      }
    }

    // 4. Populate categoryName if missing
    const resolvedCategoryName = dto.categoryName || category.name;

    // Resolve single cover image (from productCoverImage or first element of productCoverImages)
    const resolvedCoverImage =
      dto.productCoverImage ??
      (Array.isArray(dto.productCoverImages) ? dto.productCoverImages[0] : dto.productCoverImages) ??
      null;

    // 5. Construct database record
    const created = await this.prisma.product.create({
      data: {
        // A. Product and Seller Information
        sellerId: dto.sellerId || null,
        categoryId: dto.categoryId,
        ...(dto.productId ? { productId: dto.productId } : {}),
        productName: dto.productName,
        categoryName: resolvedCategoryName,
        productCoverImage: resolvedCoverImage,
        productImages: (dto.productImages || []) as any,
        sku: dto.sku || null,
        shippingWeight: dto.shippingWeight !== undefined ? dto.shippingWeight : null,
        brand: dto.brand || null,
        status: dto.status !== undefined ? dto.status : true,
        productOptions: dto.productOptions as any,
        price: dto.price,
        productType: dto.productType || null,
        discount: dto.discount !== undefined ? dto.discount : 0,
        manageVariants: dto.manageVariants ?? false,
        ribbon: dto.ribbon || null,
        trackInventory: dto.trackInventory ?? true,
        variantPrice: dto.variantPrice as any,

        // B. Product Specifications and Images
        productSpecification: dto.productSpecification as any,
        influencerBranding: dto.influencerBranding ?? false,
        activeAd: dto.activeAd ?? false,
        subcategoryName: dto.subcategoryName || null,
        subcategoryId: dto.subcategoryId || null,
        haatzaVerified: dto.haatzaVerified ?? false,
        promotionalImages: dto.promotionalImages as any,
        paymentType: dto.paymentType || null,
        returnPolicy: dto.returnPolicy as any,
        deliveryCharges: dto.deliveryCharges ?? false,
        sizeChart: dto.sizeChart || null,

        // C. Marketing and Analytics
        priorityScore: dto.priorityScore ?? 0,
        averageCpc: dto.averageCpc ?? 0,
        reach: dto.reach ?? 0,
        impression: dto.impression ?? 0,
        clicks: dto.clicks ?? 0,
        sales: dto.sales ?? 0,
        revenue: dto.revenue ?? 0,

        // D. Seller, GST and Business Information
        sellerPincode: dto.sellerPincode || null,
        isGstSeller: dto.isGstSeller ?? false,
        searchKeyword: dto.searchKeyword as any,
        isSellerEarn: dto.isSellerEarn ?? false,
        sellAndEarnCommission: dto.sellAndEarnCommission ?? 0,
        isDomestic: dto.isDomestic ?? true,
        businessState: dto.businessState || null,
        businessStateCode: dto.businessStateCode || null,
        salesTerritoryType: dto.salesTerritoryType || null,
        businessRegistrationType: dto.businessRegistrationType || null,
        gstNo: dto.gstNo || null,
        panNumber: dto.panNumber || null,

        // E. Pricing and Payment Information
        codPrice: dto.codPrice !== undefined ? dto.codPrice : null,
        upi: dto.upi !== undefined && dto.upi !== null ? String(dto.upi) : null,
        mrp: dto.mrp !== undefined ? dto.mrp : null,
        onSalePrice: dto.onSalePrice !== undefined ? dto.onSalePrice : null,
        upiPaymentDiscount: dto.upiPaymentDiscount !== undefined ? dto.upiPaymentDiscount : null,

        // F. Campaign, Category and Warehouse Information
        campaignId: dto.campaignId || null,
        similarCategoryId: dto.similarCategoryId || null,
        productHighlights: dto.productHighlights as any,
        isHaatzaLite: dto.isHaatzaLite ?? false,
        warehouseId: dto.warehouseId || null,
        warehousePincode: dto.warehousePincode || null,

        // Preserved Existing Fields
        description: dto.description || null,
        image: dto.image || null,
        stock: dto.stock ?? 0,
      },
      include: {
        category: true,
        seller: {
          select: {
            sellerId: true,
            name: true,
            companyName: true,
            city: true,
            state: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: this.serializeProduct(created),
    };
  }

  /**
   * Retrieves a single product by its ID or UUID.
   */
  async getProductById(id: string): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { productId: id },
      include: {
        category: true,
        seller: {
          select: {
            sellerId: true,
            name: true,
            companyName: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: this.serializeProduct(product),
    };
  }

  /**
   * Updates an existing product by ID.
   */
  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponse> {
    // 1. Verify existence
    const existing = await this.prisma.product.findUnique({
      where: { productId: id },
    });
    if (!existing) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    // 2. Validate relationships if changing
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID '${dto.categoryId}' does not exist.`);
      }
    }

    if (dto.sellerId) {
      const seller = await this.prisma.userMaster.findUnique({
        where: { sellerId: dto.sellerId },
      });
      if (!seller) {
        throw new NotFoundException(`Seller with sellerId '${dto.sellerId}' does not exist.`);
      }
    }

    if (dto.similarCategoryId) {
      const similarCategory = await this.prisma.category.findUnique({
        where: { id: dto.similarCategoryId },
      });
      if (!similarCategory) {
        throw new NotFoundException(`Similar Category with ID '${dto.similarCategoryId}' does not exist.`);
      }
    }

    // 3. Update in database
    const updated = await this.prisma.product.update({
      where: { productId: id },
      data: {
        ...(dto.sellerId !== undefined ? { sellerId: dto.sellerId } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
        ...(dto.productName !== undefined ? { productName: dto.productName } : {}),
        ...(dto.categoryName !== undefined ? { categoryName: dto.categoryName } : {}),
        ...(dto.productCoverImage !== undefined ? { productCoverImage: dto.productCoverImage } : {}),
        ...(dto.productCoverImages !== undefined
          ? {
              productCoverImage: Array.isArray(dto.productCoverImages)
                ? dto.productCoverImages[0]
                : dto.productCoverImages,
            }
          : {}),
        ...(dto.productImages !== undefined ? { productImages: dto.productImages as any } : {}),
        ...(dto.sku !== undefined ? { sku: dto.sku } : {}),
        ...(dto.shippingWeight !== undefined ? { shippingWeight: dto.shippingWeight } : {}),
        ...(dto.brand !== undefined ? { brand: dto.brand } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.productOptions !== undefined ? { productOptions: dto.productOptions as any } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.productType !== undefined ? { productType: dto.productType } : {}),
        ...(dto.discount !== undefined ? { discount: dto.discount } : {}),
        ...(dto.manageVariants !== undefined ? { manageVariants: dto.manageVariants } : {}),
        ...(dto.ribbon !== undefined ? { ribbon: dto.ribbon } : {}),
        ...(dto.trackInventory !== undefined ? { trackInventory: dto.trackInventory } : {}),
        ...(dto.variantPrice !== undefined ? { variantPrice: dto.variantPrice as any } : {}),

        ...(dto.productSpecification !== undefined ? { productSpecification: dto.productSpecification as any } : {}),
        ...(dto.influencerBranding !== undefined ? { influencerBranding: dto.influencerBranding } : {}),
        ...(dto.activeAd !== undefined ? { activeAd: dto.activeAd } : {}),
        ...(dto.subcategoryName !== undefined ? { subcategoryName: dto.subcategoryName } : {}),
        ...(dto.subcategoryId !== undefined ? { subcategoryId: dto.subcategoryId } : {}),
        ...(dto.haatzaVerified !== undefined ? { haatzaVerified: dto.haatzaVerified } : {}),
        ...(dto.promotionalImages !== undefined ? { promotionalImages: dto.promotionalImages as any } : {}),
        ...(dto.paymentType !== undefined ? { paymentType: dto.paymentType } : {}),
        ...(dto.returnPolicy !== undefined ? { returnPolicy: dto.returnPolicy as any } : {}),
        ...(dto.deliveryCharges !== undefined ? { deliveryCharges: dto.deliveryCharges } : {}),
        ...(dto.sizeChart !== undefined ? { sizeChart: dto.sizeChart } : {}),

        ...(dto.priorityScore !== undefined ? { priorityScore: dto.priorityScore } : {}),
        ...(dto.averageCpc !== undefined ? { averageCpc: dto.averageCpc } : {}),
        ...(dto.reach !== undefined ? { reach: dto.reach } : {}),
        ...(dto.impression !== undefined ? { impression: dto.impression } : {}),
        ...(dto.clicks !== undefined ? { clicks: dto.clicks } : {}),
        ...(dto.sales !== undefined ? { sales: dto.sales } : {}),
        ...(dto.revenue !== undefined ? { revenue: dto.revenue } : {}),

        ...(dto.sellerPincode !== undefined ? { sellerPincode: dto.sellerPincode } : {}),
        ...(dto.isGstSeller !== undefined ? { isGstSeller: dto.isGstSeller } : {}),
        ...(dto.searchKeyword !== undefined ? { searchKeyword: dto.searchKeyword as any } : {}),
        ...(dto.isSellerEarn !== undefined ? { isSellerEarn: dto.isSellerEarn } : {}),
        ...(dto.sellAndEarnCommission !== undefined ? { sellAndEarnCommission: dto.sellAndEarnCommission } : {}),
        ...(dto.isDomestic !== undefined ? { isDomestic: dto.isDomestic } : {}),
        ...(dto.businessState !== undefined ? { businessState: dto.businessState } : {}),
        ...(dto.businessStateCode !== undefined ? { businessStateCode: dto.businessStateCode } : {}),
        ...(dto.salesTerritoryType !== undefined ? { salesTerritoryType: dto.salesTerritoryType } : {}),
        ...(dto.businessRegistrationType !== undefined ? { businessRegistrationType: dto.businessRegistrationType } : {}),
        ...(dto.gstNo !== undefined ? { gstNo: dto.gstNo } : {}),
        ...(dto.panNumber !== undefined ? { panNumber: dto.panNumber } : {}),

        ...(dto.codPrice !== undefined ? { codPrice: dto.codPrice } : {}),
        ...(dto.upi !== undefined ? { upi: dto.upi !== null ? String(dto.upi) : null } : {}),
        ...(dto.mrp !== undefined ? { mrp: dto.mrp } : {}),
        ...(dto.onSalePrice !== undefined ? { onSalePrice: dto.onSalePrice } : {}),
        ...(dto.upiPaymentDiscount !== undefined ? { upiPaymentDiscount: dto.upiPaymentDiscount } : {}),

        ...(dto.campaignId !== undefined ? { campaignId: dto.campaignId } : {}),
        ...(dto.similarCategoryId !== undefined ? { similarCategoryId: dto.similarCategoryId } : {}),
        ...(dto.productHighlights !== undefined ? { productHighlights: dto.productHighlights as any } : {}),
        ...(dto.isHaatzaLite !== undefined ? { isHaatzaLite: dto.isHaatzaLite } : {}),
        ...(dto.warehouseId !== undefined ? { warehouseId: dto.warehouseId } : {}),
        ...(dto.warehousePincode !== undefined ? { warehousePincode: dto.warehousePincode } : {}),

        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.image !== undefined ? { image: dto.image } : {}),
        ...(dto.stock !== undefined ? { stock: dto.stock } : {}),
      },
      include: {
        category: true,
        seller: {
          select: {
            sellerId: true,
            name: true,
            companyName: true,
            city: true,
            state: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Product updated successfully',
      data: this.serializeProduct(updated),
    };
  }

  /**
   * Lists products with rich filtering, search, pagination, and sorting.
   */
  async listProducts(query: ProductQueryDto): Promise<ProductListResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      subcategoryId,
      sellerId,
      brand,
      status,
      minPrice,
      maxPrice,
      isHaatzaLite,
      haatzaVerified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId;
    if (sellerId) where.sellerId = sellerId;
    if (brand) where.brand = brand;
    if (status !== undefined) where.status = status;
    if (isHaatzaLite !== undefined) where.isHaatzaLite = isHaatzaLite;
    if (haatzaVerified !== undefined) where.haatzaVerified = haatzaVerified;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          seller: {
            select: {
              sellerId: true,
              name: true,
              companyName: true,
              city: true,
              state: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'Products retrieved successfully',
      data: {
        items: products.map((p) => this.serializeProduct(p)),
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    };
  }

  /**
   * Deletes a product by ID.
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.product.findUnique({
      where: { productId: id },
    });
    if (!existing) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    await this.prisma.product.delete({
      where: { productId: id },
    });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}

