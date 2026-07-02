import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('store/products/:productId/reviews')
export class ReviewsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getReviews(@Param('productId') productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return { data: reviews };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addReview(
    @Param('productId') productId: string,
    @Body() body: { rating: number; comment?: string },
    @Req() req: Request & { user?: { id: string } }
  ) {
    const userId = req.user!.id;
    
    const review = await this.prisma.review.create({
      data: {
        productId,
        userId,
        rating: body.rating,
        comment: body.comment,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return { data: review };
  }
}
