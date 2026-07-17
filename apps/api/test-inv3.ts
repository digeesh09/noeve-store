import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const search = 'test';
    const where: any = {
      product: { status: { not: 'ARCHIVED' } }
    };
    where.OR = [
      { sku: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { product: { name: { contains: search, mode: 'insensitive' } } }
    ];
    
    const data = await prisma.productVariant.findMany({
      where,
      skip: 0,
      take: 1,
      orderBy: [
        { product: { name: 'asc' } },
        { sku: 'asc' }
      ]
    });
    console.log("Success", data);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
