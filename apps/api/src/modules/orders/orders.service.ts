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
    const shippingCents = 0;
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;
    const currency = cart.lines[0]?.product.currency ?? 'INR';
    const orderNumber = `NV-${Date.now().toString(36).toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.CONFIRMED,
          subtotalCents,
          shippingCents,
          taxCents,
          totalCents,
          currency,
          lines: { create: lines },
          statusHistory: {
            create: {
              status: OrderStatus.CONFIRMED,
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
}
