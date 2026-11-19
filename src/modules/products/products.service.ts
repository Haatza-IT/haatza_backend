import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { sanitizeNulls } from '../../common/utils/null-sanitizer.util';
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
  private readonly cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 30000; // 30 seconds

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setInCache<T>(key: string, data: T, ttlMs = this.CACHE_TTL_MS): void {
    if (this.cache.size > 500) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Serializes a database product record into the standard response shape,
   * providing both new camelCase fields and legacy aliases (id, name, isActive).
   * Guaranteed zero null/undefined values using strictly typed defaults.
   * Sensitive seller details are stripped.
   */
  private serializeProduct(product: any): SerializedProduct {
    const serialized: SerializedProduct = {
      // A. Product and Seller Information (1-18)
      sellerId: String(product.sellerId ?? ''),
      categoryId: String(product.categoryId ?? ''),
      productId: String(product.productId ?? ''),
      id: String(product.productId ?? ''), // Legacy alias
      productName: String(product.productName ?? ''),
      name: String(product.productName ?? ''), // Legacy alias
      categoryName: String(product.categoryName ?? (product.category?.name ?? '')),
      productCoverImage: String(product.productCoverImage ?? ''),
      productCoverImages: product.productCoverImage ? [String(product.productCoverImage)] : [],
      productImages: Array.isArray(product.productImages) ? product.productImages : [],
      sku: String(product.sku ?? ''),
      shippingWeight: product.shippingWeight !== null && product.shippingWeight !== undefined ? Number(product.shippingWeight) : 0,
      brand: String(product.brand ?? ''),
      status: product.status !== undefined ? Boolean(product.status) : true,
      isActive: product.status !== undefined ? Boolean(product.status) : true, // Legacy alias
      productOptions: product.productOptions && typeof product.productOptions === 'object' ? product.productOptions : {},
      price: product.price !== null && product.price !== undefined ? Number(product.price) : 0,
      productType: String(product.productType ?? ''),
      discount: product.discount !== null && product.discount !== undefined ? Number(product.discount) : 0,
      manageVariants: Boolean(product.manageVariants),
      ribbon: String(product.ribbon ?? ''),
      trackInventory: product.trackInventory !== undefined ? Boolean(product.trackInventory) : true,
      variantPrice: Array.isArray(product.variantPrice) ? product.variantPrice : [],

      // B. Product Specifications and Images (19-29)
      productSpecification: product.productSpecification && typeof product.productSpecification === 'object' ? product.productSpecification : {},
      influencerBranding: Boolean(product.influencerBranding),
      activeAd: Boolean(product.activeAd),
      subcategoryName: String(product.subcategoryName ?? ''),
      subcategoryId: String(product.subcategoryId ?? ''),
      haatzaVerified: Boolean(product.haatzaVerified),
      promotionalImages: Array.isArray(product.promotionalImages) ? product.promotionalImages : [],
      paymentType: String(product.paymentType ?? ''),
      returnPolicy: product.returnPolicy ? (typeof product.returnPolicy === 'object' ? product.returnPolicy : { policy: String(product.returnPolicy) }) : {},
      deliveryCharges: Boolean(product.deliveryCharges),
      sizeChart: String(product.sizeChart ?? ''),

      // C. Marketing and Analytics (30-36)
      priorityScore: typeof product.priorityScore === 'number' ? product.priorityScore : 0,
      averageCpc: product.averageCpc !== null && product.averageCpc !== undefined ? Number(product.averageCpc) : 0,
      reach: product.reach !== null && product.reach !== undefined ? Number(product.reach) : 0,
      impression: product.impression !== null && product.impression !== undefined ? Number(product.impression) : 0,
      clicks: product.clicks !== null && product.clicks !== undefined ? Number(product.clicks) : 0,
      sales: product.sales !== null && product.sales !== undefined ? Number(product.sales) : 0,
      revenue: product.revenue !== null && product.revenue !== undefined ? Number(product.revenue) : 0,

      // D. Seller, GST and Business Information (37-48)
      sellerPincode: String(product.sellerPincode ?? ''),
      isGstSeller: Boolean(product.isGstSeller),
      searchKeyword: Array.isArray(product.searchKeyword) ? product.searchKeyword : [],
      isSellerEarn: Boolean(product.isSellerEarn),
      sellAndEarnCommission: typeof product.sellAndEarnCommission === 'number' ? product.sellAndEarnCommission : 0,
      isDomestic: product.isDomestic !== undefined ? Boolean(product.isDomestic) : true,
      businessState: String(product.businessState ?? ''),
      businessStateCode: String(product.businessStateCode ?? ''),
      salesTerritoryType: String(product.salesTerritoryType ?? ''),
      businessRegistrationType: String(product.businessRegistrationType ?? ''),
      gstNo: String(product.gstNo ?? ''),
      panNumber: String(product.panNumber ?? ''),

      // E. Pricing and Payment Information (49-53)
      codPrice: product.codPrice !== null && product.codPrice !== undefined ? Number(product.codPrice) : 0,
      upi: product.upi ? String(product.upi) : '',
      mrp: product.mrp !== null && product.mrp !== undefined ? Number(product.mrp) : 0,
      onSalePrice: product.onSalePrice !== null && product.onSalePrice !== undefined ? Number(product.onSalePrice) : 0,
      upiPaymentDiscount: product.upiPaymentDiscount !== null && product.upiPaymentDiscount !== undefined ? Number(product.upiPaymentDiscount) : 0,

      // F. Campaign, Category and Warehouse Information (54-59)
      campaignId: String(product.campaignId ?? ''),
      similarCategoryId: String(product.similarCategoryId ?? ''),
      productHighlights: Array.isArray(product.productHighlights) ? product.productHighlights : [],
      isHaatzaLite: Boolean(product.isHaatzaLite),
      warehouseId: String(product.warehouseId ?? ''),
      warehousePincode: String(product.warehousePincode ?? ''),

      // Preserved Existing Fields
      description: String(product.description ?? ''),
      image: String(product.image ?? ''),
      stock: typeof product.stock === 'number' ? product.stock : 0,
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : '',
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : '',

      // Safe Relations
      category: product.category
        ? {
            id: String(product.category.id ?? ''),
            name: String(product.category.name ?? ''),
            slug: String(product.category.slug ?? ''),
            image: String(product.category.image ?? ''),
          }
        : undefined,
      seller: product.seller
        ? {
            sellerId: String(product.seller.sellerId ?? ''),
            name: String(product.seller.name ?? ''),
            companyName: String(product.seller.companyName ?? ''),
            city: String(product.seller.city ?? ''),
            state: String(product.seller.state ?? ''),
          }
        : undefined,
    };

    return sanitizeNulls(serialized);
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

    this.clearCache();

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
    const cacheKey = `prod:${id}`;
    const cached = this.getFromCache<ProductResponse>(cacheKey);
    if (cached) {
      return cached;
    }

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

    const response: ProductResponse = {
      success: true,
      message: 'Product retrieved successfully',
      data: this.serializeProduct(product),
    };

    this.setInCache(cacheKey, response);
    return response;
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

    this.clearCache();

    return {
      success: true,
      message: 'Product updated successfully',
      data: this.serializeProduct(updated),
    };
  }

  /**
   * Lists products with rich filtering, search, pagination, and sorting.
   * High-performance in-memory caching provides millisecond response on repeated queries.
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
      sortBy = 'productId',
      sortOrder = 'desc',
    } = query;

    // Map 'createdAt' safely to 'productId' because the 60-column products table uses UUID productId
    const safeSortBy = sortBy === 'createdAt' ? 'productId' : sortBy;

    const cacheKey = `list:${JSON.stringify({ ...query, sortBy: safeSortBy })}`;
    const cached = this.getFromCache<ProductListResponse>(cacheKey);
    if (cached) {
      return cached;
    }

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
        orderBy: { [safeSortBy]: sortOrder },
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

    const response: ProductListResponse = {
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

    this.setInCache(cacheKey, response);
    return response;
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

    this.clearCache();

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}

