import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('store/settings')
  async getStoreSettings() {
    const settings = await this.settingsService.getSettings();
    return { data: settings };
  }

  @Get('admin/settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminSettings() {
    const settings = await this.settingsService.getSettings();
    return { data: settings };
  }

  @Patch('admin/settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateAdminSettings(
    @Body() body: {
      shippingThresholdCents?: number;
      shippingRateCents?: number;
      taxRatePercentage?: number;
    }
  ) {
    const settings = await this.settingsService.updateSettings(body);
    return { data: settings };
  }
}
