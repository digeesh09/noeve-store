import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getLowStockProducts(threshold: number = 10) {
    return this.prisma.productVariant.findMany({
      where: {
        stockQuantity: { lte: threshold },
        product: { status: { not: ProductStatus.ARCHIVED } }
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true, status: true }
        }
      },
      orderBy: { stockQuantity: 'asc' }
    });
  }

  async updateStock(variantId: string, quantity: number) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: quantity }
    });
  }
}
