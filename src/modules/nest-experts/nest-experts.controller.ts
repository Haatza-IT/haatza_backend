import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, UsePipes, Inject } from '@nestjs/common';
import { Throttle, seconds } from '@nestjs/throttler';
import { NestExpertsService } from './nest-experts.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { nestExpertUpdateSchema } from './nest-experts.schema';
import type { NestExpertUpdateDto, NestExpertResponse } from './nest-experts.types';

@Controller('api/haatza_nest_experts')
@UseGuards(AdminAuthGuard)
@Throttle({ default: { limit: 10, ttl: seconds(60) } })
export class NestExpertsController {
  constructor(
    @Inject(NestExpertsService)
    private readonly nestExpertsService: NestExpertsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(nestExpertUpdateSchema))
  async updateNestExpert(@Body() dto: NestExpertUpdateDto): Promise<NestExpertResponse> {
    return this.nestExpertsService.updateNestExpertStatus(dto);
  }
}
