import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';

@ApiTags('Storefront Blogs')
@Controller('store/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published blog posts' })
  async listPosts(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('category') category?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const ps = pageSize ? parseInt(pageSize, 10) : 20;
    return this.blogsService.listPublishedPosts(p, ps, category);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all blog categories' })
  async listCategories() {
    return this.blogsService.listCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a specific published blog post by slug' })
  async getPostBySlug(@Param('slug') slug: string) {
    return this.blogsService.getPublishedPostBySlug(slug);
  }
}
