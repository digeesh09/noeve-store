import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReviewsService } from './reviews.service';
import { AdminReviewsController } from './admin-reviews.controller';
import { StoreReviewsController } from './store-reviews.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminReviewsController, StoreReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
