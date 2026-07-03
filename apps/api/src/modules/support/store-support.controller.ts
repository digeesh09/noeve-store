import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('store/support')
export class StoreSupportController {
  constructor(private supportService: SupportService) {}

  @Post()
  async createTicket(
    @Request() req: any,
    @Body() body: { name: string; email: string; subject: string; message: string }
  ) {
    const userId = req.user?.id; // Optional: If user is logged in
    return this.supportService.createTicket({ ...body, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tickets')
  async listUserTickets(@Request() req: any) {
    return this.supportService.listUserTickets(req.user.id);
  }
}
