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

  async getDailyRevenue(startDate?: string, endDate?: string) {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(end.getDate() - 30));

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { notIn: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED, OrderStatus.REFUNDED] }
      },
      select: { createdAt: true, totalCents: true }
    });

    // Group by YYYY-MM-DD
    const dailyMap = new Map<string, number>();
    for (const o of orders) {
      const dateKey = o.createdAt.toISOString().split('T')[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + (o.totalCents || 0));
    }

    const data = Array.from(dailyMap.entries())
      .map(([date, revenueCents]) => ({ date, revenueCents }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return data;
  }

  async getOrdersByStatus() {
    const stats = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    });
    return stats.map(s => ({ status: s.status, count: s._count.id }));
  }
}
