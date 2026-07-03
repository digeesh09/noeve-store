import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('store/products')
export class StoreReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get(':productId/reviews')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.listStoreReviews(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId/reviews')
  async createReview(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() body: { rating: number; comment?: string },
  ) {
    return this.reviewsService.createReview(req.user.id, productId, body.rating, body.comment);
  }
}
