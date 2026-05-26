import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, UserRole } from '@prisma/client';
import { paginationQuerySchema } from '@noeve/validation';
import { PrismaService } from '../../prisma/prisma.service';

const FULFILLMENT_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.PICKED, OrderStatus.CANCELLED],
  [OrderStatus.PICKED]: [OrderStatus.PACKED],
  [OrderStatus.PACKED]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

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
}
