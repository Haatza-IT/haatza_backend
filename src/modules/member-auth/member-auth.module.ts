import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MemberAuthController } from './member-auth.controller';
import { MemberAuthService } from './member-auth.service';
import { Fast2SmsService } from './fast2sms.service';
import { EmailService } from './email.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MemberAuthController],
  providers: [MemberAuthService, Fast2SmsService, EmailService],
  exports: [MemberAuthService, Fast2SmsService, EmailService],
})
export class MemberAuthModule {}

