import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { MembersModule } from './modules/members/members.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { NestExpertsModule } from './modules/nest-experts/nest-experts.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    PrismaModule,
    MembersModule,
    SellersModule,
    EmployeesModule,
    NestExpertsModule,
    HealthModule,
  ],
})
export class AppModule {}

