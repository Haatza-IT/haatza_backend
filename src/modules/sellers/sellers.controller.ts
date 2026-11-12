import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { sellerRegistrationSchema } from '../user-master/user-master.schema';
import type { SellerRegistrationDto } from '../user-master/user-master.types';

@Controller('api/haatza_seller')
export class SellersController {
  constructor(
    @Inject(SellersService)
    private readonly sellersService: SellersService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(sellerRegistrationSchema))
  async registerSeller(@Body() dto: SellerRegistrationDto) {
    return this.sellersService.registerSeller(dto);
  }
}

