import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { UserRole } from '@prisma/client';

@Controller('admin/support')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
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

  @Get(':id')
  async getTicket(@Param('id') id: string) {
    const data = await this.supportService.getTicketById(id);
    return { data };
  }

  @Post(':id/reply')
  async addReply(
    @Param('id') id: string,
    @Body('message') message: string,
  ) {
    const data = await this.supportService.addReply(id, message, true);
    return { data };
  }

  @Patch(':id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    const data = await this.supportService.updateTicketStatus(id, status);
    return { data };
  }
}

