import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async listPublishedPosts(page = 1, pageSize = 20, categorySlug?: string) {
    const where: any = { published: true };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getPublishedPostBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { category: true },
    });
    
    if (!post || !post.published) {
      throw new NotFoundException('Post not found');
    }
    
    return { data: post };
  }

  async listCategories() {
    const categories = await this.prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return { data: categories };
  }

  // --- Admin Methods ---

  async adminListPosts(page = 1, pageSize = 20) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.post.count(),
    ]);

    return {
      data: posts,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async adminGetPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return { data: post };
  }

  async createPost(data: any) {
    // Generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const post = await this.prisma.post.create({ data });
    return { data: post };
  }

  async updatePost(id: string, data: any) {
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date();
    } else if (data.published === false) {
      data.publishedAt = null;
    }

    const post = await this.prisma.post.update({
      where: { id },
      data,
    });
    return { data: post };
  }

  async deletePost(id: string) {
    await this.prisma.post.delete({ where: { id } });
    return { success: true };
  }
}
