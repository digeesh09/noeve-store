import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN') || 'noeve_secret_token';
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('WhatsApp Webhook verified.');
      return challenge;
    }
    return null;
  }

  async processIncomingMessage(body: any) {
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.value && change.value.messages) {
            for (const message of change.value.messages) {
              const from = message.from;
              const text = message.text?.body;
              
              if (text && from) {
                await this.handleMessage(from, text);
              }
            }
          }
        }
      }
    }
  }

  private async handleMessage(phoneNumber: string, text: string) {
    this.logger.log(`Received WA message from ${phoneNumber}: ${text}`);
    
    let user = await this.prisma.user.findFirst({
      where: {
        addresses: {
          some: { phone: { contains: phoneNumber.replace('+', '') } }
        }
      }
    });

    if (!user) {
      this.logger.log(`No user found for phone ${phoneNumber}. Creating lead...`);
      user = await this.prisma.user.create({
        data: {
          email: `${phoneNumber}@whatsapp.lead`,
          firstName: 'WA',
          lastName: 'Lead',
          passwordHash: 'none',
        }
      });
    }

    let ticket = await this.prisma.supportTicket.findFirst({
      where: { userId: user.id, status: 'OPEN' }
    });

    if (!ticket) {
      ticket = await this.prisma.supportTicket.create({
        data: {
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          subject: `WhatsApp Chat with ${phoneNumber}`,
          message: text,
        }
      });
    } else {
      await this.prisma.supportTicketReply.create({
        data: {
          ticketId: ticket.id,
          message: text,
          isAdmin: false,
        }
      });
    }
  }
}
