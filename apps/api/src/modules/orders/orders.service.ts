import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { paginationQuerySchema, placeOrderSchema } from '@noeve/validation';
import type { PlaceOrderInput } from '@noeve/validation';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

const FULFILLMENT_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.PICKED, OrderStatus.CANCELLED],
  [OrderStatus.PICKED]: [OrderStatus.PACKED],
  [OrderStatus.PACKED]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
};

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cart: CartService,
  ) {}

  async listForUser(userId: string, query: Record<string, unknown>) {
    const { page, pageSize } = paginationQuerySchema.parse(query);
    const where = { userId };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { lines: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async listAll(query: Record<string, unknown>) {
    const { page, pageSize } = paginationQuerySchema.parse(query);
    const status = query.status as OrderStatus | undefined;
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { lines: true, user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string, userId?: string) {
    const order = await this.prisma.order.findFirst({
      where: userId ? { id, userId } : { id },
      include: { lines: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return { data: order };
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    actorId: string,
    note?: string,
    trackingNumber?: string,
    carrier?: string,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const allowed = FULFILLMENT_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
      throw new NotFoundException(
        `Cannot transition from ${order.status} to ${status}`,
      );
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
          note,
          createdBy: actorId,
        },
      });

      return result;
    });

    // MOCK NOTIFICATION SYSTEM
    // In a production system, you would push this to a queue or call an email/SMS provider
    console.log(`[NOTIFICATION] Order ${updated.orderNumber} status changed to ${status}. Email sent to customer.`);

    return { data: updated };
  }

  async createFromCart(userId: string, sessionId: string | undefined, input: PlaceOrderInput) {
    const { note } = placeOrderSchema.parse(input);

    if (sessionId) {
      await this.cart.mergeSessionToUser(userId, sessionId);
    }

    const cart = await this.cart.getCartForCheckout(userId);
    if (!cart) {
      throw new BadRequestException('Cart is empty');
    }

    for (const line of cart.lines) {
      if (line.variant) {
        if (line.variant.stockQuantity < line.quantity) {
          throw new BadRequestException(`Insufficient stock for ${line.product.name}`);
        }
      }
    }

    const lines = cart.lines.map((line) => {
      const unitPriceCents = line.variant?.priceCents ?? line.product.basePriceCents;
      return {
        productId: line.productId,
        variantId: line.variantId,
        productName: line.product.name,
        sku: line.variant?.sku ?? line.product.slug,
        quantity: line.quantity,
        unitPriceCents,
        lineTotalCents: unitPriceCents * line.quantity,
      };
    });

    const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
    const currency = cart.lines[0]?.product.currency ?? 'INR';
    
    // Taxation & Shipping logic
    const taxRate = 0.18; // 18% GST
    const taxCents = Math.round(subtotalCents * taxRate);
    
    // Free shipping on orders over 15000 INR ($150 USD equivalent), otherwise 1000 INR
    let shippingCents = 0;
    if (subtotalCents < 1500000) { 
      shippingCents = 100000; // $10 or 1000 INR flat rate
    }

    const totalCents = Math.max(0, subtotalCents + shippingCents + taxCents - ((input as any).discountCents || 0));
    const orderNumber = `NV-${Date.now().toString(36).toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING_PAYMENT,
          subtotalCents,
          shippingCents,
          taxCents,
          discountCents: (input as any).discountCents || 0,
          totalCents,
          currency,
          promotionCode: (input as any).promotionCode,
          lines: { create: lines },
          statusHistory: {
            create: {
              status: OrderStatus.PENDING_PAYMENT,
              note: note ?? 'Order placed',
              createdBy: userId,
            },
          },
        },
        include: { lines: true, statusHistory: true },
      });

      for (const line of cart.lines) {
        if (line.variantId) {
          await tx.productVariant.update({
            where: { id: line.variantId },
            data: { stockQuantity: { decrement: line.quantity } },
          });
        }
      }

      await tx.cartLine.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return { data: order };
  }

  // --- PROMOTIONS ---
  async listPromotions() {
    const promotions = await this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { data: promotions };
  }

  async createPromotion(data: { code: string, description?: string, discountPercentage?: number, discountCents?: number, minOrderValue?: number }) {
    const promo = await this.prisma.promotion.create({ data });
    return { data: promo };
  }

  async deletePromotion(id: string) {
    await this.prisma.promotion.delete({ where: { id } });
    return { success: true };
  }

  async validatePromotion(code: string, cartTotalCents: number) {
    const promo = await this.prisma.promotion.findUnique({ where: { code } });
    if (!promo || !promo.isActive) {
      throw new BadRequestException('Invalid or expired promotion code');
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      throw new BadRequestException('Promotion has expired');
    }
    if (promo.minOrderValue > cartTotalCents) {
      throw new BadRequestException(`Minimum order value is ${promo.minOrderValue / 100}`);
    }
    
    let discount = 0;
    if (promo.discountPercentage) {
      discount = Math.round(cartTotalCents * (promo.discountPercentage / 100));
    } else if (promo.discountCents) {
      discount = promo.discountCents;
    }
    
    return { data: { discountCents: discount, code: promo.code } };
  }
}
