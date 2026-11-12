import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { NestExpertsService } from './nest-experts.service';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { nestExpertUpdateSchema } from '../user-master/user-master.schema';
import type { NestExpertUpdateDto } from '../user-master/user-master.types';

@Controller('api/haatza_nest_experts')
@UseGuards(AdminAuthGuard)
export class NestExpertsController {
  constructor(
    @Inject(NestExpertsService)
    private readonly nestExpertsService: NestExpertsService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(nestExpertUpdateSchema))
  async updateNestExpertStatus(@Body() dto: NestExpertUpdateDto) {
    return this.nestExpertsService.updateNestExpertStatus(dto);
  }
}

