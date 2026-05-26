import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { CreateProductInput } from '@noeve/validation';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CatalogService } from './catalog.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminCatalogController {
  constructor(private catalog: CatalogService) {}

  @Get('products')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  listProducts(@Query() query: Record<string, unknown>) {
    return this.catalog.listProducts(query, false);
  }

  @Post('products')
  @Roles(UserRole.ADMIN)
  createProduct(@Body() body: CreateProductInput) {
    return this.catalog.createProduct(body);
  }
}
