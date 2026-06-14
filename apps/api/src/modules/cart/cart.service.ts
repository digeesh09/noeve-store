import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { addToCartSchema, updateCartLineSchema } from '@noeve/validation';
import type { AddToCartInput, UpdateCartLineInput } from '@noeve/validation';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';

export interface CartContext {
  userId?: string;
  sessionId?: string;
}

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateSession(): Promise<string> {
    return randomUUID();
  }

  private async resolveCart(ctx: CartContext) {
    if (ctx.userId) {
      let cart = await this.prisma.cart.findUnique({ where: { userId: ctx.userId } });
      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId: ctx.userId } });
      }
      return cart;
    }

    if (!ctx.sessionId) {
      throw new BadRequestException('Cart session required');
    }

    let cart = await this.prisma.cart.findUnique({ where: { sessionId: ctx.sessionId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { sessionId: ctx.sessionId } });
    }
    return cart;
  }

  async getCart(ctx: CartContext) {
    if (!ctx.userId && !ctx.sessionId) {
      return {
        data: {
          id: null,
          sessionId: null,
          lines: [],
          subtotalCents: 0,
          itemCount: 0,
          currency: 'INR',
        },
      };
    }
    const cart = await this.resolveCart(ctx);
    return this.formatCart(cart.id);
  }

  async addItem(ctx: CartContext, input: AddToCartInput) {
    const data = addToCartSchema.parse(input);
    const cart = await this.resolveCart(ctx);

    const product = await this.prisma.product.findFirst({
      where: { id: data.productId, status: ProductStatus.ACTIVE },
      include: { variants: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let variantId: string | null = data.variantId ?? null;

    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }
      if (variant.stockQuantity < data.quantity) {
        throw new BadRequestException('Insufficient stock');
      }
    } else if (product.variants.length === 1) {
      const variant = product.variants[0];
      variantId = variant.id;
      if (variant.stockQuantity < data.quantity) {
        throw new BadRequestException('Insufficient stock');
      }
    } else if (product.variants.length > 1) {
      throw new BadRequestException('Please select a variant');
    }

    const existing = await this.prisma.cartLine.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
        variantId,
      },
    });

    if (existing) {
      await this.prisma.cartLine.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + data.quantity },
      });
    } else {
      await this.prisma.cartLine.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          variantId,
          quantity: data.quantity,
        },
      });
    }

    return this.formatCart(cart.id);
  }

  async updateLine(ctx: CartContext, lineId: string, input: UpdateCartLineInput) {
    const { quantity } = updateCartLineSchema.parse(input);
    const cart = await this.resolveCart(ctx);

    const line = await this.prisma.cartLine.findFirst({
      where: { id: lineId, cartId: cart.id },
    });
    if (!line) {
      throw new NotFoundException('Cart line not found');
    }

    await this.prisma.cartLine.update({
      where: { id: lineId },
      data: { quantity },
    });

    return this.formatCart(cart.id);
  }

  async removeLine(ctx: CartContext, lineId: string) {
    const cart = await this.resolveCart(ctx);
    const line = await this.prisma.cartLine.findFirst({
      where: { id: lineId, cartId: cart.id },
    });
    if (!line) {
      throw new NotFoundException('Cart line not found');
    }
    await this.prisma.cartLine.delete({ where: { id: lineId } });
    return this.formatCart(cart.id);
  }

  async clearCart(ctx: CartContext) {
    const cart = await this.resolveCart(ctx);
    await this.prisma.cartLine.deleteMany({ where: { cartId: cart.id } });
    return this.formatCart(cart.id);
  }

  /** Merge guest session cart lines into the authenticated user's cart. */
  async mergeSessionToUser(userId: string, sessionId: string) {
    const sessionCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { lines: true },
    });
    if (!sessionCart || sessionCart.lines.length === 0) {
      return;
    }

    const userCart = await this.resolveCart({ userId });

    for (const line of sessionCart.lines) {
      const existing = await this.prisma.cartLine.findFirst({
        where: {
          cartId: userCart.id,
          productId: line.productId,
          variantId: line.variantId,
        },
      });

      if (existing) {
        await this.prisma.cartLine.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + line.quantity },
        });
      } else {
        await this.prisma.cartLine.create({
          data: {
            cartId: userCart.id,
            productId: line.productId,
            variantId: line.variantId,
            quantity: line.quantity,
          },
        });
      }
    }

    await this.prisma.cartLine.deleteMany({ where: { cartId: sessionCart.id } });
    await this.prisma.cart.delete({ where: { id: sessionCart.id } });
  }

  async getCartForCheckout(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        lines: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.lines.length === 0) {
      return null;
    }

    return cart;
  }

  private async formatCart(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        lines: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
            },
            variant: true,
          },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const lines = cart.lines.map((line) => {
      const unitPriceCents = line.variant?.priceCents ?? line.product.basePriceCents;
      return {
        id: line.id,
        quantity: line.quantity,
        productId: line.productId,
        variantId: line.variantId,
        productName: line.product.name,
        productSlug: line.product.slug,
        sku: line.variant?.sku ?? line.product.slug,
        imageUrl: line.product.images[0]?.url ?? null,
        unitPriceCents,
        lineTotalCents: unitPriceCents * line.quantity,
        currency: line.product.currency,
      };
    });

    const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

    return {
      data: {
        id: cart.id,
        sessionId: cart.sessionId,
        lines,
        subtotalCents,
        itemCount,
        currency: lines[0]?.currency ?? 'INR',
      },
    };
  }
}
