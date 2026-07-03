const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { email: 'hello@testmail.com' },
  });
  console.log(subscriber);
  await prisma.$disconnect();
}

main().catch(console.error);
