import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { StoreCartController } from './store-cart.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [StoreCartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
