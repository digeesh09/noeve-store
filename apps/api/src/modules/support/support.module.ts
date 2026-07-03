import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { StoreSupportController } from './store-support.controller';
import { AdminSupportController } from './admin-support.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SupportService],
  controllers: [StoreSupportController, AdminSupportController],
})
export class SupportModule {}
