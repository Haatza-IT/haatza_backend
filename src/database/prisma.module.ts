import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserMasterRepository } from './user-master.repository';

@Global()
@Module({
  providers: [PrismaService, UserMasterRepository],
  exports: [PrismaService, UserMasterRepository],
})
export class PrismaModule {}

