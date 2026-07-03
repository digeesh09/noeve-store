import { Controller, Get, Param, Patch, Body, Delete, UseGuards, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  async listReviews(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const size = pageSize ? parseInt(pageSize, 10) : 20;
    return this.reviewsService.listAdminReviews(p, size);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'PENDING' },
  ) {
    return this.reviewsService.updateReviewStatus(id, body.status);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    await this.reviewsService.deleteReview(id);
    return { success: true };
  }
}
