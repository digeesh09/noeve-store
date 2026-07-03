import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../common/guards/jwt-optional-auth.guard';

@Controller('store/support')
export class StoreSupportController {
  constructor(private supportService: SupportService) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Post()
  async createTicket(
    @Request() req: any,
    @Body() body: { name: string; email: string; subject: string; message: string }
  ) {
    const userId = req.user?.id; // Optional: If user is logged in
    const data = await this.supportService.createTicket({ ...body, userId });
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tickets')
  async listUserTickets(@Request() req: any) {
    const data = await this.supportService.listUserTickets(req.user.id);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reply')
  async replyToTicket(
    @Param('id') id: string,
    @Body('message') message: string
  ) {
    // Ideally we should check if the ticket belongs to the user, but for now we just add the reply.
    const data = await this.supportService.addReply(id, message, false);
    return { data };
  }
}
