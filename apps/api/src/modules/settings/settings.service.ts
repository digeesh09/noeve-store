import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StoreSettings } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(): Promise<StoreSettings> {
    let settings = await this.prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.storeSettings.create({
        data: {
          shippingThresholdCents: 1500000,
          shippingRateCents: 100000,
          taxRatePercentage: 0,
        },
      });
    }
    return settings;
  }

  async updateSettings(data: {
    shippingThresholdCents?: number;
    shippingRateCents?: number;
    taxRatePercentage?: number;
    marqueeText?: string;
  }): Promise<StoreSettings> {
    const settings = await this.getSettings();
    return this.prisma.storeSettings.update({
      where: { id: settings.id },
      data,
    });
  }
}
