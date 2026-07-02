import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { NewsletterController } from './newsletter.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, NewsletterController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
