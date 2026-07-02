import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('store/newsletter')
export class NewsletterController {
  constructor(private usersService: UsersService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { email: string }) {
    if (!body.email) {
      throw new Error('Email is required');
    }
    await this.usersService.subscribeNewsletter(body.email);
    return { data: { success: true } };
  }
}
