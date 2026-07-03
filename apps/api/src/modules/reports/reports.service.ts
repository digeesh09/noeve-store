import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesSummary(startDate?: string, endDate?: string) {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(end.getDate() - 30));

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { notIn: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED, OrderStatus.REFUNDED] }
      }
    });

    const totalRevenueCents = orders.reduce((sum, order) => sum + (order.totalCents || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValueCents = totalOrders > 0 ? totalRevenueCents / totalOrders : 0;

    return {
      totalRevenueCents,
      totalOrders,
      averageOrderValueCents,
      period: { start, end }
    };
  }

  async getTopProducts(limit: number = 10) {
    const topProducts = await this.prisma.orderLine.groupBy({
      by: ['productId', 'productName'],
      _sum: {
        quantity: true,
        lineTotalCents: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit,
    });
    
    return topProducts;
  }

  async getRecentTransactions(limit: number = 10) {
     return this.prisma.payment.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            order: {
                select: {
                    orderNumber: true,
                    user: {
                        select: { firstName: true, lastName: true, email: true }
                    }
                }
            }
        }
     });
  }
}
