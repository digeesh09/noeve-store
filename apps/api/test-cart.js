const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const product = await prisma.product.findFirst({ include: { variants: true } });
  if (!product) return console.log("No product");
  const cart = await prisma.cart.create({ data: { sessionId: 'test-session' } });
  
  console.log("Cart created:", cart.id);
  
  await prisma.cartLine.create({
    data: {
      cartId: cart.id,
      productId: product.id,
      variantId: product.variants[0]?.id || null,
      quantity: 1
    }
  });
  console.log("Cart line added");
}
run().catch(console.error).finally(() => prisma.$disconnect());
