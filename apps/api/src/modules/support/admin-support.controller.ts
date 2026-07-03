import { Controller, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/support')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminSupportController {
  constructor(private supportService: SupportService) {}

  @Get()
  async listTickets(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const size = pageSize ? parseInt(pageSize, 10) : 20;
    return this.supportService.listAdminTickets(p, size);
  }

  @Patch(':id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.supportService.updateTicketStatus(id, status);
  }
}
