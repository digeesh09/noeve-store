import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { paginationQuerySchema, placeOrderSchema } from '@noeve/validation';
import type { PlaceOrderInput } from '@noeve/validation';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { MailService } from '../mail/mail.service';

const FULFILLMENT_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.PICKED, OrderStatus.CANCELLED],
  [OrderStatus.PICKED]: [OrderStatus.PACKED],
  [OrderStatus.PACKED]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
};

import * as path from 'path';
import * as fs from 'fs';
const PDFDocument = require('pdfkit');

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cart: CartService,
    private mailService: MailService,
  ) {}

  async listForUser(userId: string, query: Record<string, unknown>) {
    const { page, pageSize } = paginationQuerySchema.parse(query);
    const where = { userId };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { lines: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    const productIds = Array.from(new Set(orders.flatMap((o) => o.lines.map((l) => l.productId))));
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, slug: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const enrichedOrders = orders.map((order) => ({
      ...order,
      lines: order.lines.map((line) => {
        const product = productMap.get(line.productId);
        return {
          ...line,
          imageUrl: product?.images[0]?.url || null,
          productSlug: product?.slug || '',
        };
      }),
    }));

    return {
      data: enrichedOrders,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async listAll(query: Record<string, unknown>) {
    const { page, pageSize } = paginationQuerySchema.parse(query);
    const status = query.status as OrderStatus | undefined;
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          lines: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              addresses: { where: { isDefault: true }, take: 1 },
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string, userId?: string) {
    const order = await this.prisma.order.findFirst({
      where: userId ? { id, userId } : { id },
      include: { lines: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return { data: order };
  }

  async generateInvoice(id: string, userId?: string): Promise<PDFKit.PDFDocument> {
    const order = await this.prisma.order.findFirst({
      where: userId ? { id, userId } : { id },
      include: { lines: true, user: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const doc = new PDFDocument({ margin: 50 });

    // Header
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 120 });
    } else {
      doc.fillColor('#8a3744').fontSize(24).font('Helvetica-Bold').text('NOEVE', 50, 50);
    }

    doc
      .fillColor('#444444')
      .fontSize(10)
      .font('Helvetica')
      .text('Noeve Studio', 200, 50, { align: 'right' })
      .text('123 Noeve Street, Design District', 200, 65, { align: 'right' })
      .text('Kerala, India 682001', 200, 80, { align: 'right' })
      .text('Email: hello@noeve.com | Phone: +91 98765 43210', 200, 95, { align: 'right' })
      .text('GSTIN: 32AABCU9603R1ZM', 200, 110, { align: 'right' })
      .moveDown();

    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 130).lineTo(550, 130).stroke();

    // Customer & Order Info
    doc
      .fillColor('#444444')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('INVOICE', 50, 145)
      .font('Helvetica')
      .text(`Invoice Number: ${order.orderNumber}`, 50, 160)
      .text(`Invoice Date: ${order.createdAt.toLocaleDateString()}`, 50, 175)
      .text(`Status: ${order.status}`, 50, 190);

    const customerName = order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest';
    doc
      .font('Helvetica-Bold')
      .text('Billed To:', 300, 145)
      .font('Helvetica')
      .text(customerName, 300, 160);
    if (order.user?.email) {
      doc.text(order.user.email, 300, 175);
    }

    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 215).lineTo(550, 215).stroke();

    // Items table header
    doc
      .fillColor('#444444')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Item', 50, 230)
      .text('SKU', 250, 230)
      .text('Quantity', 350, 230)
      .text('Price', 400, 230)
      .text('Total', 480, 230)
      .moveDown();

    doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, 245).lineTo(550, 245).stroke();

    // Items
    let y = 260;
    for (const line of order.lines) {
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(line.productName, 50, y, { width: 190 })
        .text(line.sku, 250, y)
        .text(line.quantity.toString(), 350, y)
        .text((line.unitPriceCents / 100).toFixed(2), 400, y)
        .text((line.lineTotalCents / 100).toFixed(2), 480, y);
      y += 20;
    }

    // Totals
    doc.strokeColor('#cccccc').lineWidth(1).moveTo(350, y).lineTo(550, y).stroke();
    y += 10;
    doc.text('Subtotal:', 380, y).text((order.subtotalCents / 100).toFixed(2), 480, y);
    y += 15;
    doc.text('Tax:', 380, y).text((order.taxCents / 100).toFixed(2), 480, y);
    y += 15;
    doc.text('Shipping:', 380, y).text((order.shippingCents / 100).toFixed(2), 480, y);

    if (order.discountCents > 0) {
      y += 15;
      doc.text('Discount:', 380, y).text('-' + (order.discountCents / 100).toFixed(2), 480, y);
    }

    y += 20;
    doc
      .strokeColor('#cccccc')
      .lineWidth(1)
      .moveTo(350, y - 5)
      .lineTo(550, y - 5)
      .stroke();
    doc
      .fontSize(12)
      .text('Total:', 380, y)
      .text(`${order.currency} ${(order.totalCents / 100).toFixed(2)}`, 480, y);

    // Footer
    const bottom = doc.page.height - 100;
    doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, bottom).lineTo(550, bottom).stroke();
    doc
      .fillColor('#888888')
      .fontSize(9)
      .font('Helvetica')
      .text('Thank you for shopping with Noeve Studio.', 50, bottom + 20, { align: 'center' })
      .text('Returns are accepted within 30 days of purchase with original packaging. For support, email hello@noeve.com.', 50, bottom + 35, { align: 'center' });

    doc.end();
    return doc;
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    actorId: string,
    note?: string,
    trackingNumber?: string,
    carrier?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true } } },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const allowed = FULFILLMENT_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
      throw new NotFoundException(`Cannot transition from ${order.status} to ${status}`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          trackingNumber: trackingNumber ?? order.trackingNumber,
          carrier: carrier ?? order.carrier,
        },
        include: { lines: true, statusHistory: true },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status,
          note,
          createdBy: actorId,
        },
      });

      return result;
    });

    if (order.user?.email) {
      this.mailService
        .sendOrderStatusUpdate(
          order.user.email,
          updated.orderNumber,
          status,
          updated.trackingNumber || undefined,
          updated.carrier || undefined,
        )
        .catch(console.error);
    }

    return { data: updated };
  }

  async createFromCart(userId: string, sessionId: string | undefined, input: PlaceOrderInput) {
    const { note } = placeOrderSchema.parse(input);

    if (sessionId) {
      await this.cart.mergeSessionToUser(userId, sessionId);
    }

    const cart = await this.cart.getCartForCheckout(userId);
    if (!cart) {
      throw new BadRequestException('Cart is empty');
    }

    for (const line of cart.lines) {
      if (line.variant) {
        if (line.variant.stockQuantity < line.quantity) {
          throw new BadRequestException(`Insufficient stock for ${line.product.name}`);
        }
      }
    }

    const lines = cart.lines.map((line) => {
      const unitPriceCents = line.variant?.priceCents ?? line.product.basePriceCents;
      return {
        productId: line.productId,
        variantId: line.variantId,
        productName: line.product.name,
        sku: line.variant?.sku ?? line.product.slug,
        quantity: line.quantity,
        unitPriceCents,
        lineTotalCents: unitPriceCents * line.quantity,
      };
    });

    const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
    const currency = cart.lines[0]?.product.currency ?? 'INR';

    // Taxation & Shipping logic
    const storeSettings = await this.prisma.storeSettings.findFirst();
    const defaultTaxRate = storeSettings ? storeSettings.taxRatePercentage / 100 : 0.18;

    let taxCents = 0;
    for (const line of cart.lines) {
      const unitPriceCents = line.variant?.priceCents ?? line.product.basePriceCents;
      const lineTotalCents = unitPriceCents * line.quantity;
      const catTaxRate = line.product.category?.taxRatePercentage;
      const rateToUse =
        catTaxRate !== null && catTaxRate !== undefined ? catTaxRate / 100 : defaultTaxRate;
      taxCents += Math.round(lineTotalCents * rateToUse);
    }

    // Shipping threshold from settings, default to 15000 INR
    const shippingThresholdCents = storeSettings ? storeSettings.shippingThresholdCents : 1500000;
    const shippingRateCentsFallback = storeSettings ? storeSettings.shippingRateCents : 100000;

    let shippingCents = 0;
    if (subtotalCents < shippingThresholdCents) {
      shippingCents = shippingRateCentsFallback;
    }

    const totalCents = Math.max(
      0,
      subtotalCents + shippingCents + taxCents - ((input as any).discountCents || 0),
    );
    const orderNumber = `NV-${Date.now().toString(36).toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING_PAYMENT,
          subtotalCents,
          shippingCents,
          taxCents,
          discountCents: (input as any).discountCents || 0,
          totalCents,
          currency,
          promotionCode: (input as any).promotionCode,
          lines: { create: lines },
          statusHistory: {
            create: {
              status: OrderStatus.PENDING_PAYMENT,
              note: note ?? 'Order placed',
              createdBy: userId,
            },
          },
        },
        include: { lines: true, statusHistory: true },
      });

      for (const line of cart.lines) {
        if (line.variantId) {
          await tx.productVariant.update({
            where: { id: line.variantId },
            data: { stockQuantity: { decrement: line.quantity } },
          });
        }
      }

      await tx.cartLine.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (user?.email) {
      const formattedTotal = (order.totalCents / 100).toLocaleString('en-IN', {
        style: 'currency',
        currency: order.currency,
        maximumFractionDigits: 0,
      });
      this.mailService
        .sendOrderConfirmation(user.email, order.orderNumber, formattedTotal)
        .catch(console.error);
    }

    return { data: order };
  }

  // --- PROMOTIONS ---
  async listPromotions(query: Record<string, unknown>) {
    const { page, pageSize } = paginationQuerySchema.parse(query);

    const [promotions, total] = await Promise.all([
      this.prisma.promotion.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count(),
    ]);

    return {
      data: promotions,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async createPromotion(data: {
    code: string;
    description?: string;
    discountPercentage?: number;
    discountCents?: number;
    minOrderValue?: number;
  }) {
    const promo = await this.prisma.promotion.create({ data });
    return { data: promo };
  }

  async deletePromotion(id: string) {
    await this.prisma.promotion.delete({ where: { id } });
    return { success: true };
  }

  async validatePromotion(code: string, cartTotalCents: number) {
    const promo = await this.prisma.promotion.findUnique({ where: { code } });
    if (!promo || !promo.isActive) {
      throw new BadRequestException('Invalid or expired promotion code');
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      throw new BadRequestException('Promotion has expired');
    }
    if (promo.minOrderValue > cartTotalCents) {
      throw new BadRequestException(`Minimum order value is ${promo.minOrderValue / 100}`);
    }

    let discount = 0;
    if (promo.discountPercentage) {
      discount = Math.round(cartTotalCents * (promo.discountPercentage / 100));
    } else if (promo.discountCents) {
      discount = promo.discountCents;
    }

    return { data: { discountCents: discount, code: promo.code } };
  }
}
