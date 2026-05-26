import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { createProductSchema } from '@noeve/validation';
import type { CreateProductInput } from '@noeve/validation';
import { paginationQuerySchema } from '@noeve/validation';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async listCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return { data: categories };
  }

  async listProducts(query: Record<string, unknown>, activeOnly = true) {
    const { page, pageSize } = paginationQuerySchema.parse(query);
    const where = activeOnly ? { status: ProductStatus.ACTIVE } : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true, category: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true, category: true },
    });
    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new NotFoundException('Product not found');
    }
    return { data: product };
  }

  async createProduct(input: CreateProductInput) {
    const data = createProductSchema.parse(input);
    const product = await this.prisma.product.create({
      data: {
        ...data,
        status: ProductStatus.DRAFT,
      },
      include: { images: true, variants: true },
    });
    return { data: product };
  }
}
