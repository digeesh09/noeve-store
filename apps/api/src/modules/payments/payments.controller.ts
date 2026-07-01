import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { IsString, IsNotEmpty } from 'class-validator';

class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string;
}

class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;
}

@Controller('store/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('create-session')
  createSession(@Body() body: CreateSessionDto) {
    return this.payments.createPaymentSession(body.orderId);
  }

  @Post('verify')
  verify(@Body() body: VerifyPaymentDto) {
    return this.payments.verifyPayment(
      body.orderId,
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
    );
  }
}
