import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async listStoreReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, status: ReviewStatus.APPROVED },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(userId: string, productId: string, rating: number, comment?: string) {
    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        status: ReviewStatus.PENDING,
      },
    });
  }

  async listAdminReviews(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take: pageSize,
        include: {
          product: { select: { name: true } },
          user: { select: { email: true, firstName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count(),
    ]);
    return { data, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
  }

  async updateReviewStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: { status },
    });
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.prisma.review.delete({ where: { id } });
  }
}
