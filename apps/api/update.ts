import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.product.updateMany({
    where: { status: 'DRAFT' },
    data: { status: 'ACTIVE' }
  });
}
main();
