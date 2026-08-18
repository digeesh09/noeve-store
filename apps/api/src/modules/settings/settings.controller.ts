import { Controller, Get, Patch, Body, UseGuards, Post, Delete, Param } from '@nestjs/common';
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
      storeName?: string;
      supportEmail?: string;
      supportPhone?: string;
      whatsappNumber?: string;
      facebookLink?: string;
      instagramLink?: string;
      codAllowed?: boolean;
      shippingThresholdCents?: number;
      shippingRateCents?: number;
      taxRatePercentage?: number;
      marqueeText?: string;
      storeState?: string;
      gstin?: string;
    }
  ) {
    const settings = await this.settingsService.updateSettings(body);
    return { data: settings };
  }

  @Get('admin/tax-rules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getTaxRules() {
    const rules = await this.settingsService.getTaxRules();
    return { data: rules };
  }

  @Post('admin/tax-rules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createTaxRule(@Body() body: { hsnCode: string; description?: string; cgstPercentage: number; sgstPercentage: number; igstPercentage: number }) {
    const rule = await this.settingsService.createTaxRule(body);
    return { data: rule };
  }

  @Patch('admin/tax-rules/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateTaxRule(
    @Param('id') id: string,
    @Body() body: { hsnCode?: string; description?: string; cgstPercentage?: number; sgstPercentage?: number; igstPercentage?: number }
  ) {
    const rule = await this.settingsService.updateTaxRule(id, body);
    return { data: rule };
  }

  @Delete('admin/tax-rules/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteTaxRule(@Param('id') id: string) {
    return this.settingsService.deleteTaxRule(id);
  }
}
