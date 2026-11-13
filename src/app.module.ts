import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { PrismaModule } from './database/prisma.module';
import { MembersModule } from './modules/members/members.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { NestExpertsModule } from './modules/nest-experts/nest-experts.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Rate Limiting: In-memory throttler protecting endpoints against brute-force and spamming
    // Default limit: 60 requests per minute per IP for general endpoints
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: seconds(60),
        limit: 60,
      },
    ]),
    PrismaModule,
    AuthModule,
    MembersModule,
    SellersModule,
    EmployeesModule,
    NestExpertsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
