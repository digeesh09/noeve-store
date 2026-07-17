import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReportsService } from '../reports.service';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class AdminReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('sales')
  getSalesData(@Query('period') period?: string) {
    return this.reportsService.getSalesData(period || '30d');
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit?: string) {
    return this.reportsService.getTopProducts(limit ? parseInt(limit, 10) : 5);
  }

  @Get('inventory-alerts')
  getInventoryAlerts() {
    return this.reportsService.getInventoryAlerts();
  }

  @Get('user-acquisition')
  getUserAcquisition() {
    return this.reportsService.getUserAcquisition();
  }

  @Get('top-customers')
  getTopCustomers(@Query('limit') limit?: string) {
    return this.reportsService.getTopCustomers(limit ? parseInt(limit, 10) : 5);
  }

  @Get('product-heatmap')
  getProductHeatmap(@Query() query: Record<string, string>) {
    return this.reportsService.getProductHeatmap(query);
  }
}
