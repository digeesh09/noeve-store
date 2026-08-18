import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as Papa from 'papaparse';

@Injectable()
export class ReconciliationService {
  constructor(private readonly prisma: PrismaService) {}

  async processSettlementReport(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const csvData = file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    if (parsed.errors.length > 0) {
      throw new BadRequestException('Invalid CSV format');
    }

    const results = {
      totalProcessed: 0,
      settled: 0,
      discrepancies: 0,
      notFound: 0,
    };

    for (const row of parsed.data as any[]) {
      const orderNumber = row['Order ID'] || row['Order Number'] || row['AWB'];
      const settledAmountStr = row['Settled Amount'] || row['Amount'];
      const partnerName = row['Partner'] || 'Unknown';
      const reference = row['Reference'] || row['Transaction ID'];

      if (!orderNumber || !settledAmountStr) {
        continue;
      }

      const settledAmountCents = Math.round(parseFloat(settledAmountStr) * 100);
      
      const order = await this.prisma.order.findUnique({
        where: { orderNumber },
        include: { codSettlement: true },
      });

      if (!order) {
        results.notFound++;
        continue;
      }

      const expectedAmountCents = order.totalCents;
      let status: 'SETTLED_TO_BANK' | 'DISCREPANCY' = 'SETTLED_TO_BANK';
      let discrepancyReason = null;

      if (settledAmountCents < expectedAmountCents) {
        status = 'DISCREPANCY';
        discrepancyReason = `Short payment. Expected ${expectedAmountCents / 100}, got ${settledAmountCents / 100}`;
        results.discrepancies++;
      } else {
        results.settled++;
      }

      await this.prisma.cODSettlement.upsert({
        where: { orderId: order.id },
        update: {
          status,
          settledAmountCents,
          expectedAmountCents,
          partnerName,
          settlementReference: reference,
          settledAt: new Date(),
          discrepancyReason,
        },
        create: {
          orderId: order.id,
          status,
          settledAmountCents,
          expectedAmountCents,
          partnerName,
          settlementReference: reference,
          settledAt: new Date(),
          discrepancyReason,
        },
      });

      if (status === 'SETTLED_TO_BANK') {
        const existingPayment = await this.prisma.payment.findUnique({ where: { orderId: order.id } });
        if (existingPayment) {
          await this.prisma.payment.update({
            where: { id: existingPayment.id },
            data: { status: 'SUCCESS' },
          });
        } else {
          await this.prisma.payment.create({
            data: {
              orderId: order.id,
              amountCents: settledAmountCents,
              status: 'SUCCESS',
              provider: 'COD',
            },
          });
        }
      }

      results.totalProcessed++;
    }

    return results;
  }
}
