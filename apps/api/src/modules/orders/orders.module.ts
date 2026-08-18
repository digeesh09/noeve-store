import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { PaymentsModule } from '../payments/payments.module';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from './orders.service';
import { StoreOrdersController } from './store-orders.controller';

@Module({
  imports: [CartModule, PaymentsModule],
  controllers: [StoreOrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
