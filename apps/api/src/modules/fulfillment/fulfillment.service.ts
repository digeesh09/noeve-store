import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class FulfillmentService {
  private readonly logger = new Logger(FulfillmentService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async markPicked(orderId: string, actorId: string, note?: string) {
    return this.transitionOrder(orderId, OrderStatus.PICKED, actorId, note);
  }

  async markPacked(orderId: string, actorId: string, note?: string) {
    return this.transitionOrder(orderId, OrderStatus.PACKED, actorId, note);
  }

  async markShipped(orderId: string, actorId: string, trackingNumber: string, carrier: string, note?: string) {
    const updated = await this.transitionOrder(orderId, OrderStatus.SHIPPED, actorId, note, trackingNumber, carrier);
    
    // Also update or create the Shipment record
    await this.prisma.shipment.upsert({
      where: { orderId },
      create: {
        orderId,
        trackingNumber,
        carrier,
        dispatchedAt: new Date(),
      },
      update: {
        trackingNumber,
        carrier,
        dispatchedAt: new Date(),
      },
    });

    return updated;
  }

  private async transitionOrder(
    orderId: string,
    status: OrderStatus,
    actorId: string,
    note?: string,
    trackingNumber?: string,
    carrier?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          trackingNumber: trackingNumber ?? order.trackingNumber,
          carrier: carrier ?? order.carrier,
        },
        include: { lines: true, statusHistory: true },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status,
          note: note ?? `Order marked as ${status} via fulfillment pipeline`,
          createdBy: actorId,
        },
      });

      return result;
    });

    // Notify customer on status update
    if (order.user?.email) {
      this.mailService
        .sendOrderStatusUpdate(order.user.email, updated.orderNumber, status, updated.trackingNumber || undefined, updated.carrier || undefined)
        .catch((err) => this.logger.error('Failed to send status update email', err));
    }

    return { data: updated };
  }
}
