import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UsersService } from './users.service';

@Controller('admin/marketing/subscribers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminNewsletterController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  async listSubscribers(@Query() query: Record<string, unknown>) {
    return this.usersService.listSubscribers(query);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  async toggleSubscriber(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.usersService.toggleSubscriber(id, body.isActive);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteSubscriber(@Param('id') id: string) {
    await this.usersService.deleteSubscriber(id);
    return { success: true };
  }

  @Post('campaign')
  @Roles(UserRole.ADMIN)
  async sendCampaign(@Body() body: { subject: string; html: string }) {
    return this.usersService.sendMarketingCampaign(body.subject, body.html);
  }
}
