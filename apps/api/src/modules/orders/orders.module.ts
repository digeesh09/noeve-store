import { Module } from '@nestjs/common';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from './orders.service';
import { StoreOrdersController } from './store-orders.controller';

@Module({
  controllers: [StoreOrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
