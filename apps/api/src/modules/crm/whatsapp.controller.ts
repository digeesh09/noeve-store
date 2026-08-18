import { Controller, Get, Post, Query, Body, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';

@Controller('webhook/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verifiedChallenge = this.whatsappService.verifyWebhook(mode, token, challenge);
    if (verifiedChallenge) {
      return res.status(HttpStatus.OK).send(verifiedChallenge);
    }
    return res.status(HttpStatus.FORBIDDEN).send('Verification failed');
  }

  @Post()
  async handleIncomingMessage(@Body() body: any, @Res() res: Response) {
    await this.whatsappService.processIncomingMessage(body);
    return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
  }
}
