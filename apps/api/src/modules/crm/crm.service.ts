import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    
    const whereClause: any = { role: 'CUSTOMER' };
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          _count: {
            select: { orders: true, supportTickets: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where: whereClause })
    ]);

    return { data: customers, meta: { total, page, limit } };
  }

  async getCustomerInsights(customerId: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          where: { status: { notIn: ['PENDING_PAYMENT', 'CANCELLED'] } },
          select: { totalCents: true }
        },
        supportTickets: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const lifetimeValueCents = customer.orders.reduce((sum, order) => sum + order.totalCents, 0);
    const totalOrders = customer.orders.length;
    const averageOrderValueCents = totalOrders > 0 ? lifetimeValueCents / totalOrders : 0;

    return {
      lifetimeValueCents,
      totalOrders,
      averageOrderValueCents,
      recentTickets: customer.supportTickets,
      recentReviews: customer.reviews,
    };
  }
}
