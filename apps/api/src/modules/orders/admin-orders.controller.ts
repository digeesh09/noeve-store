import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { OrderStatus, UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OrdersService } from './orders.service';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminOrdersController {
  constructor(private orders: OrdersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FULFILLMENT, UserRole.SUPPORT)
  list(@Query() query: Record<string, unknown>) {
    return this.orders.listAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.FULFILLMENT, UserRole.SUPPORT)
  getOne(@Param('id') id: string) {
    return this.orders.getById(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.FULFILLMENT)
  updateStatus(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; note?: string; trackingNumber?: string; carrier?: string },
  ) {
    return this.orders.updateStatus(
      id,
      body.status,
      req.user.id,
      body.note,
      body.trackingNumber,
      body.carrier,
    );
  }
}
