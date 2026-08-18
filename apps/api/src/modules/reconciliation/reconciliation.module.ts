import { Module } from '@nestjs/common';
import { ReconciliationController } from './reconciliation.controller';
import { ReconciliationWebhooksController } from './reconciliation-webhooks.controller';
import { ReconciliationService } from './reconciliation.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReconciliationController, ReconciliationWebhooksController],
  providers: [ReconciliationService],
})
export class ReconciliationModule {}
