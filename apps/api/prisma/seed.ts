import { PrismaClient, ProductStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const customerPassword = await bcrypt.hash('Customer123!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@noeve.local' },
    update: {},
    create: {
      email: 'admin@noeve.local',
      passwordHash: adminPassword,
      firstName: 'Noeve',
      lastName: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'customer@noeve.local' },
    update: {},
    create: {
      email: 'customer@noeve.local',
      passwordHash: customerPassword,
      firstName: 'Demo',
      lastName: 'Customer',
      role: UserRole.CUSTOMER,
    },
  });

  const jewellery = await prisma.category.upsert({
    where: { slug: 'jewellery' },
    update: {},
    create: {
      name: 'Jewellery',
      slug: 'jewellery',
      description: 'Fine jewellery collection',
      sortOrder: 1,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'pendants' },
    update: {},
    create: {
      name: 'Pendants',
      slug: 'pendants',
      description: 'Elegant pendants',
      sortOrder: 2,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'care-accessories' },
    update: {},
    create: {
      name: 'Care & Accessories',
      slug: 'care-accessories',
      description: 'Ladies care and accessories',
      sortOrder: 3,
    },
  });

  await prisma.product.upsert({
    where: { slug: 'gold-pendant-classic' },
    update: {},
    create: {
      name: 'Gold Pendant — Classic',
      slug: 'gold-pendant-classic',
      description: '18K gold pendant with timeless design.',
      status: ProductStatus.ACTIVE,
      categoryId: jewellery.id,
      basePriceCents: 2499900,
      currency: 'INR',
      material: 'Gold',
      purity: '18K',
      weightGrams: 4.2,
      careInstructions: 'Store in a dry pouch. Avoid perfumes directly on metal.',
      images: {
        create: [
          {
            url: 'https://placehold.co/800x800/e8d5a3/1a1a2e?text=Gold+Pendant',
            alt: 'Gold Pendant Classic',
            sortOrder: 0,
          },
        ],
      },
      variants: {
        create: [
          { sku: 'GPC-001', name: 'Default', priceCents: 2499900, stockQuantity: 10 },
        ],
      },
    },
  });

  console.log('Seed complete.');
  console.log('  Admin:    admin@noeve.local / Admin123!');
  console.log('  Customer: customer@noeve.local / Customer123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
