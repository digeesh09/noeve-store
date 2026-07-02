import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AddressInput } from '@noeve/validation';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addAddress(userId: string, data: AddressInput) {
    const existing = await this.prisma.address.count({ where: { userId } });
    
    // If this is the first address, or isDefault is true, unset other defaults
    if (data.isDefault || existing === 0) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...data,
        isDefault: data.isDefault || existing === 0,
        userId,
      },
    });
  }

  async updateAddress(userId: string, id: string, data: AddressInput) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!address) throw new NotFoundException('Address not found');

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async deleteAddress(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!address) throw new NotFoundException('Address not found');

    await this.prisma.address.delete({
      where: { id },
    });

    if (address.isDefault) {
      const nextAddress = await this.prisma.address.findFirst({
        where: { userId },
      });
      if (nextAddress) {
        await this.prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }
  }

  async subscribeNewsletter(email: string) {
    return this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });
  }
}
