import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { NewsletterController } from './newsletter.controller';
import { AdminNewsletterController } from './admin-newsletter.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, NewsletterController, AdminNewsletterController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
