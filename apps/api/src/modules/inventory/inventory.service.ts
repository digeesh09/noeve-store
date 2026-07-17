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

  async getAllInventory(page = 1, pageSize = 20, search = '') {
    const where: any = {
      product: { status: { not: ProductStatus.ARCHIVED } }
    };
    if (search) {
      where.OR = [
        { sku: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.productVariant.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          product: { select: { id: true, name: true, slug: true, status: true } }
        },
        orderBy: [
          { product: { name: 'asc' } },
          { sku: 'asc' }
        ]
      }),
      this.prisma.productVariant.count({ where })
    ]);
    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    };
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
