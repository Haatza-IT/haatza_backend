import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, UseGuards, Inject } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { sellerRegistrationSchema } from './sellers.schema';
import type { SellerRegistrationDto, SellerResponse } from './sellers.types';

@Controller('api/haatza_seller')
export class SellersController {
  constructor(
    @Inject(SellersService)
    private readonly sellersService: SellersService,
  ) { }

  @UseGuards(AdminAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(sellerRegistrationSchema))
  async registerSeller(@Body() dto: SellerRegistrationDto): Promise<SellerResponse> {
    return this.sellersService.registerSeller(dto);
  }
}
