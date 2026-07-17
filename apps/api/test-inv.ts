import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const data = await prisma.productVariant.findMany({
      where: {
        product: { status: { not: 'ARCHIVED' } }
      },
      skip: 0,
      take: 1,
      orderBy: [
        { product: { name: 'asc' } },
        { sku: 'asc' }
      ]
    });
    console.log("Success:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
