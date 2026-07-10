import { Controller, Get, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('store/shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('rates')
  async getRates(
    @Query('postalCode') postalCode: string,
    @Query('weight') weightGrams: string,
  ) {
    const weight = weightGrams ? parseInt(weightGrams, 10) : 500;
    return this.shippingService.getLiveRates(postalCode, weight);
  }
}
