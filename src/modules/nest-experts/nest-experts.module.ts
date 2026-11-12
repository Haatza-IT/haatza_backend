import { Module } from '@nestjs/common';
import { NestExpertsController } from './nest-experts.controller';
import { NestExpertsService } from './nest-experts.service';

@Module({
  controllers: [NestExpertsController],
  providers: [NestExpertsService],
  exports: [NestExpertsService],
})
export class NestExpertsModule {}

