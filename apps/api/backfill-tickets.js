const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const unlinkedTickets = await prisma.supportTicket.findMany({ where: { userId: null } });
  let count = 0;
  for (const t of unlinkedTickets) {
    const user = await prisma.user.findUnique({ where: { email: t.email } });
    if (user) {
      await prisma.supportTicket.update({ where: { id: t.id }, data: { userId: user.id } });
      count++;
    }
  }
  console.log(`Backfilled ${count} tickets.`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
