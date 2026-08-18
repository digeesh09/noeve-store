const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const orders = await prisma.order.findMany({
    where: { payment: { status: 'SUCCESS' } }
  });
  console.log('Payment status SUCCESS:', orders.length);
  const all = await prisma.order.findMany();
  console.log('Total orders:', all.length);
  
  const paymentIs = await prisma.order.findMany({
    where: { payment: { is: { status: 'SUCCESS' } } }
  });
  console.log('Payment is SUCCESS:', paymentIs.length);
}
main().finally(() => prisma.$disconnect());
