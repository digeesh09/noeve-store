import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

class AddToWishlistDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;
}

@Controller('store/wishlist')
@UseGuards(JwtAuthGuard)
export class StoreWishlistController {
  constructor(private wishlist: WishlistService) {}

  @Get()
  getWishlist(@Req() req: { user: { id: string } }) {
    return this.wishlist.getWishlist(req.user.id);
  }

  @Post()
  addToWishlist(
    @Req() req: { user: { id: string } },
    @Body() body: AddToWishlistDto,
  ) {
    return this.wishlist.addToWishlist(req.user.id, body.productId);
  }

  @Delete(':productId')
  removeFromWishlist(
    @Req() req: { user: { id: string } },
    @Param('productId') productId: string,
  ) {
    return this.wishlist.removeFromWishlist(req.user.id, productId);
  }
}
