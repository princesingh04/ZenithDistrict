import { PrismaClient, ProductStatus, SectionStatus } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  {
    slug: 'i-hate-love-pdf',
    name: 'I Hate Love PDF',
    description:
      'A free PDF toolkit designed to make everyday document tasks simpler, faster, and more accessible.',
    category: 'Productivity / PDF Tools',
    url: 'https://ihatelovepdf.com/',
    status: ProductStatus.LIVE,
    sortOrder: 1,
  },
  {
    slug: 'product-forum',
    name: 'Product.forum',
    description:
      'A platform for discovering and showcasing digital products, tools, and projects built by creators.',
    category: 'Product Discovery',
    url: 'https://product.forum',
    status: ProductStatus.LIVE,
    sortOrder: 2,
  },
  {
    slug: 'gitfc',
    name: 'GitFC',
    description:
      'A gamified GitHub contributions experience that makes developer activity more engaging and visual.',
    category: 'Developer Tools',
    url: 'https://gitfc.vercel.app/',
    status: ProductStatus.LIVE,
    sortOrder: 3,
  },
];

const initialSections = [
  { key: 'brands', status: SectionStatus.COMING_SOON },
  { key: 'labs', status: SectionStatus.COMING_SOON },
];

async function main() {
  console.log('Seeding database products and site sections...');

  // Seed Products (Idempotent via upsert by slug)
  for (const item of initialProducts) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        category: item.category,
        url: item.url,
        status: item.status,
        sortOrder: item.sortOrder,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        category: item.category,
        url: item.url,
        status: item.status,
        sortOrder: item.sortOrder,
      },
    });
    console.log(`✓ Product upserted: ${product.name} (${product.slug}) [${product.status}]`);
  }

  // Seed SiteSections (Idempotent via upsert by key)
  for (const item of initialSections) {
    const section = await prisma.siteSection.upsert({
      where: { key: item.key },
      update: {
        status: item.status,
      },
      create: {
        key: item.key,
        status: item.status,
      },
    });
    console.log(`✓ SiteSection upserted: ${section.key} [${section.status}]`);
  }

  console.log('Database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Database seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
