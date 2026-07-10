import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FulfillmentService } from './fulfillment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

class FulfillmentNoteDto {
  @IsString()
  @IsOptional()
  note?: string;
}

class ShipOrderDto extends FulfillmentNoteDto {
  @IsString()
  @IsNotEmpty()
  trackingNumber!: string;

  @IsString()
  @IsNotEmpty()
  carrier!: string;
}

@ApiTags('Fulfillment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  @Post(':orderId/pick')
  @ApiOperation({ summary: 'Mark an order as picked' })
  markPicked(@Param('orderId') orderId: string, @Body() body: FulfillmentNoteDto, @Request() req: any) {
    return this.fulfillmentService.markPicked(orderId, req.user.userId, body.note);
  }

  @Post(':orderId/pack')
  @ApiOperation({ summary: 'Mark an order as packed' })
  markPacked(@Param('orderId') orderId: string, @Body() body: FulfillmentNoteDto, @Request() req: any) {
    return this.fulfillmentService.markPacked(orderId, req.user.userId, body.note);
  }

  @Post(':orderId/ship')
  @ApiOperation({ summary: 'Mark an order as shipped and attach tracking' })
  markShipped(@Param('orderId') orderId: string, @Body() body: ShipOrderDto, @Request() req: any) {
    return this.fulfillmentService.markShipped(orderId, req.user.userId, body.trackingNumber, body.carrier, body.note);
  }
}
