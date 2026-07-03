import { Module } from '@nestjs/common';
import { AdminCrmController } from './admin-crm/admin-crm.controller';
import { CrmService } from './crm.service';

@Module({
  controllers: [AdminCrmController],
  providers: [CrmService]
})
export class CrmModule {}
