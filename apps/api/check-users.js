const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    console.log(`User: ${u.email} (id=${u.id})`);
  }
}
run().finally(() => prisma.$disconnect());
