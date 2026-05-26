import { Module } from '@nestjs/common';
import { AdminHealthController } from './admin-health.controller';
import { StoreHealthController } from './store-health.controller';

@Module({
  controllers: [StoreHealthController, AdminHealthController],
})
export class HealthModule {}
