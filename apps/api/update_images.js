const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.productImage.findMany();
  
  let count = 0;
  for (const image of images) {
    if (!image.url.includes('/public/uploads/')) {
      await prisma.productImage.update({
        where: { id: image.id },
        data: {
          url: 'http://localhost:3001/public/uploads/placeholder.png',
        }
      });
      count++;
    }
  }
  console.log(`Updated ${count} images with placeholder image.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
