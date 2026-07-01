import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StoreWishlistController } from './store-wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [PrismaModule],
  controllers: [StoreWishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
