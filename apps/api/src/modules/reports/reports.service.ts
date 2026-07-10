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

    // Fill missing dates
    const data = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      data.push({
        date: dateKey,
        revenueCents: dailyMap.get(dateKey) || 0
      });
    }

    return data;
  }

  async getUserAcquisition() {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 5); // 6 months total including current
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: { gte: start, lte: end }
      },
      select: { createdAt: true }
    });

    const monthlyMap = new Map<string, number>();
    for (const u of users) {
      const monthKey = u.createdAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
    }

    const data = [];
    for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
      const monthKey = d.toISOString().substring(0, 7);
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      data.push({
        monthKey,
        month: monthName,
        users: monthlyMap.get(monthKey) || 0
      });
    }

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
