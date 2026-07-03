const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const tickets = await prisma.supportTicket.findMany();
  console.log("All tickets:");
  for (const t of tickets) {
    console.log(`- ${t.subject} (${t.email}): userId=${t.userId}`);
  }
}
run().finally(() => prisma.$disconnect());
