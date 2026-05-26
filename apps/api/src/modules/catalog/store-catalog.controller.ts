import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('store')
export class StoreCatalogController {
  constructor(private catalog: CatalogService) {}

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get('products')
  listProducts(@Query() query: Record<string, unknown>) {
    return this.catalog.listProducts(query, true);
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.catalog.getProductBySlug(slug);
  }
}
