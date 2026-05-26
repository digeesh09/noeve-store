import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('store/orders')
@UseGuards(JwtAuthGuard)
export class StoreOrdersController {
  constructor(private orders: OrdersService) {}

  @Get()
  list(@Req() req: { user: { id: string } }, @Query() query: Record<string, unknown>) {
    return this.orders.listForUser(req.user.id, query);
  }

  @Get(':id')
  getOne(@Req() req: { user: { id: string } }, @Param('id') id: string) {
    return this.orders.getById(id, req.user.id);
  }
}
