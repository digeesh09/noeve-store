import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { createProductSchema, updateProductSchema } from '@noeve/validation';
import type { CreateProductInput, UpdateProductInput } from '@noeve/validation';
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
        orderBy: query.sort === 'popular' ? { viewCount: 'desc' } : { createdAt: 'desc' },
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
    
    // Increment view count asynchronously
    this.prisma.product.update({ where: { slug }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    return { data: product };
  }

  async createProduct(input: CreateProductInput) {
    const { images, variants, ...data } = createProductSchema.parse(input);
    const product = await this.prisma.product.create({
      data: {
        ...data,
        status: ProductStatus.ACTIVE,
        images: images?.length ? { create: images } : undefined,
        variants: variants?.length ? { create: variants } : undefined,
      },
      include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
    });
    return { data: product };
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    const { images, variants, ...data } = updateProductSchema.parse(input);
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        status: ProductStatus.ACTIVE,
        images: images ? { deleteMany: {}, create: images } : undefined,
        variants: variants ? {
          deleteMany: { id: { notIn: variants.map((v: any) => v.id).filter(Boolean) as string[] } },
          upsert: variants.map((v: any) => ({
            where: { id: v.id || 'new' },
            update: { sku: v.sku, name: v.name, priceCents: v.priceCents, stockQuantity: v.stockQuantity },
            create: { sku: v.sku, name: v.name, priceCents: v.priceCents, stockQuantity: v.stockQuantity },
          }))
        } : undefined,
      },
      include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
    });
    return { data: product };
  }

  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }
}
