import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from '../inventory.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminInventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('low-stock')
  getLowStockProducts(@Query('threshold') threshold?: string) {
    return this.inventoryService.getLowStockProducts(threshold ? parseInt(threshold, 10) : 10);
  }

  @Patch('stock/:variantId')
  updateStock(
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number
  ) {
    return this.inventoryService.updateStock(variantId, quantity);
  }
}
