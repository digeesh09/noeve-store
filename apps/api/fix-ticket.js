const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const customer = await prisma.user.findUnique({ where: { email: 'customer@noeve.local' } });
  if (customer) {
    await prisma.supportTicket.updateMany({
      where: { email: 'john@mai.com' },
      data: { userId: customer.id }
    });
    console.log("Updated ticket to belong to customer@noeve.local");
  }
}
run().finally(() => prisma.$disconnect());
