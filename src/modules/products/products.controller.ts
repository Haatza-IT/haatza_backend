import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from './products.schema';
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  ProductResponse,
  ProductListResponse,
} from './products.types';

@Controller(['api/products', 'products'])
export class ProductsController {
  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Creates a new product with all 59 fields.
   */
  @UseGuards(AdminAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body(new ZodValidationPipe(createProductSchema)) dto: CreateProductDto,
  ): Promise<ProductResponse> {
    return this.productsService.createProduct(dto);
  }

  /**
   * Lists products with query parameters, search, filtering, and pagination.
   */
  @Get()
  async listProducts(
    @Query(new ZodValidationPipe(productQuerySchema)) query: ProductQueryDto,
  ): Promise<ProductListResponse> {
    return this.productsService.listProducts(query);
  }

  /**
   * Retrieves a single product by ID or UUID.
   */
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductResponse> {
    return this.productsService.getProductById(id);
  }

  /**
   * Updates an existing product completely.
   */
  @UseGuards(AdminAuthGuard)
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return this.productsService.updateProduct(id, dto);
  }

  /**
   * Updates an existing product partially.
   */
  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  async patchProduct(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return this.productsService.updateProduct(id, dto);
  }

  /**
   * Deletes a product by ID.
   */
  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.productsService.deleteProduct(id);
  }
}

