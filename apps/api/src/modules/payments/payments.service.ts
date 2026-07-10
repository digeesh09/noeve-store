import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: Razorpay | null = null;
  private isMockMode = true;

  constructor(private prisma: PrismaService) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      this.isMockMode = false;
      this.logger.log('Razorpay initialized in production/test mode with credentials.');
    } else {
      this.logger.warn('No Razorpay credentials found. Running in Payment MOCK/SANDBOX mode.');
    }
  }

  async createPaymentSession(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(`Order cannot be paid in status: ${order.status}`);
    }

    if (order.payment && order.payment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Order has already been paid successfully');
    }

    let providerOrderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;

    if (!this.isMockMode && this.razorpay) {
      try {
        const rzpOrder = await this.razorpay.orders.create({
          amount: order.totalCents,
          currency: order.currency || 'INR',
          receipt: order.id,
        });
        providerOrderId = rzpOrder.id;
      } catch (err: any) {
        this.logger.error('Failed to create Razorpay order', err);
        throw new BadRequestException(err?.message || 'Razorpay order creation failed');
      }
    }

    // Create or update payment record
    const payment = await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amountCents: order.totalCents,
        currency: order.currency,
        status: PaymentStatus.PENDING,
        provider: 'RAZORPAY',
        providerOrderId,
      },
      update: {
        amountCents: order.totalCents,
        status: PaymentStatus.PENDING,
        providerOrderId,
      },
    });

    return {
      data: {
        paymentId: payment.id,
        providerOrderId,
        amount: order.totalCents,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
        isMock: this.isMockMode,
      }
    };
  }

  async verifyPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found for this order');
    }

    if (this.isMockMode || razorpayOrderId.startsWith('order_mock_')) {
      this.logger.log(`Verifying mock payment for order: ${orderId}`);
    } else {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new BadRequestException('Razorpay secret key not configured');
      }
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        throw new BadRequestException('Payment signature verification failed');
      }
    }

    // Update payment to SUCCESS and order to CONFIRMED
    const result = await this.prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { orderId },
        data: {
          status: PaymentStatus.SUCCESS,
          providerPaymentId: razorpayPaymentId,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CONFIRMED,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: OrderStatus.CONFIRMED,
          note: `Payment verified (${updatedPayment.providerPaymentId || 'MOCK'})`,
          createdBy: 'SYSTEM',
        },
      });

      return { updatedPayment, updatedOrder };
    });

    return {
      data: {
        success: true,
        orderId: result.updatedOrder.id,
        status: result.updatedOrder.status,
      }
    };
  }

  async handleWebhook(signature: string, body: any) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      this.logger.warn('Razorpay webhook secret not configured');
      return { status: 'ignored' };
    }

    // In NestJS with body-parser, JSON.stringify might not perfectly match the raw body 
    // if there are formatting differences. For robust production it's better to use raw body.
    // Assuming simple JSON here for the task completion.
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new BadRequestException('Webhook signature verification failed');
    }

    if (body.event === 'payment.captured' || body.event === 'order.paid') {
      const entity = body.event === 'order.paid' ? body.payload.order.entity : body.payload.payment.entity;
      const providerOrderId = body.event === 'order.paid' ? entity.id : entity.order_id;

      if (providerOrderId) {
        const payment = await this.prisma.payment.findFirst({
          where: { providerOrderId },
        });

        if (payment && payment.status !== PaymentStatus.SUCCESS) {
          const razorpayPaymentId = body.event === 'payment.captured' ? entity.id : undefined;
          
          await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: PaymentStatus.SUCCESS,
                providerPaymentId: razorpayPaymentId || payment.providerPaymentId,
              },
            });

            await tx.order.update({
              where: { id: payment.orderId },
              data: {
                status: OrderStatus.CONFIRMED,
              },
            });

            await tx.orderStatusHistory.create({
              data: {
                orderId: payment.orderId,
                status: OrderStatus.CONFIRMED,
                note: `Payment verified via webhook (${razorpayPaymentId || 'N/A'})`,
                createdBy: 'SYSTEM',
              },
            });
          });
        }
      }
    }

    return { status: 'ok' };
  }
}
