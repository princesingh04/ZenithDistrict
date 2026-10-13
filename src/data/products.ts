import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ProductStatus as DbProductStatus } from '@prisma/client';
import { ProductVenture, Product, ProductStatus } from './types';

export type { Product, ProductStatus };

export const productsData: ProductVenture[] = [
  {
    slug: 'i-hate-love-pdf',
    name: 'I Hate Love PDF',
    description:
      'A free PDF toolkit designed to make everyday document tasks simpler, faster, and more accessible.',
    category: 'Productivity / PDF Tools',
    url: 'https://ihatelovepdf.com/',
    status: 'live',
    order: 1,
    id: 'prod-01',
    division: 'Z-03',
    divisionSlug: 'products',
    tagline: 'Private, in-browser PDF manipulation without predatory ads or file size barriers.',
    longDescription:
      'Most online PDF converters have become bloated with deceptive ads, arbitrary file size paywalls, and questionable privacy policies. I Hate Love PDF runs essential PDF manipulation tasks client-side using WebAssembly and Web Workers, keeping files completely on the user’s machine.',
    featured: true,
    featuredOrder: 1,
    tags: ['WebAssembly', 'PDF Utility', 'Client-Side', 'Privacy First'],
    startedAt: '2026-Q2',
    updatedAt: '2026-Q4',
    theme: {
      accent: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.12)',
    },
    problem:
      'Everyday users frequently need to merge two PDFs or extract pages, but are forced through ad-choked web tools that upload sensitive personal documents to unknown remote servers.',
    solution:
      'A stripped-back, high-performance web tool where all cryptographic rendering and document modifications execute inside the browser sandbox using WebAssembly.',
    architectureNotes: [
      'PDF-lib and WebAssembly for in-memory byte manipulation',
      'Zero server upload architecture ensures GDPR and HIPAA friendly processing',
      'Web Workers prevent UI freezing during large multi-page compilations',
    ],
    roadmap: [
      {
        phase: 'Phase 1: Core Operations',
        status: 'Shipped',
        summary: 'PDF merge, split, rotate, and page reordering.',
      },
      {
        phase: 'Phase 2: Client Optimization',
        status: 'In Progress',
        summary: 'Local image-to-PDF compilation and client-side raster compression.',
      },
    ],
    links: {
      live: 'https://ihatelovepdf.com/',
      repo: 'https://github.com/ShreyashSrivastavaa/i-hate-love-pdf',
    },
  },
  {
    slug: 'product-forum',
    name: 'Product.forum',
    description:
      'A platform for discovering and showcasing digital products, tools, and projects built by creators.',
    category: 'Product Discovery',
    url: 'https://product.forum',
    status: 'live',
    order: 2,
    id: 'prod-02',
    division: 'Z-03',
    divisionSlug: 'products',
    tagline: 'Transparent discovery and verification for modern products and businesses.',
    longDescription:
      'Online feedback loops are increasingly polluted by bot upvotes, sponsored placements, and unverified reviews. Product.forum explores a high-trust verification model where discussion is anchored to authentic usage and founder disclosures.',
    featured: true,
    featuredOrder: 2,
    tags: ['Community', 'Product Discovery', 'Verification', 'Directory'],
    startedAt: '2026-Q2',
    updatedAt: '2026-Q4',
    theme: {
      accent: '#3B82F6',
      badgeBg: 'rgba(59, 130, 246, 0.12)',
    },
    problem:
      'Modern product launch platforms have skewed toward vanity metrics, coordinated voting rings, and shallow engagement, making it hard to identify genuinely useful products.',
    solution:
      'An architectural forum layout that prioritizes verified engineering teardowns, longitudinal user reviews, and structured founder AMA threads.',
    architectureNotes: [
      'Next.js App Router with hybrid static-dynamic indexing',
      'PostgreSQL full-text search with vector ranking for product discovery',
      'Cryptographic domain ownership verification for creators',
    ],
    roadmap: [
      {
        phase: 'Alpha Prototype',
        status: 'Shipped',
        summary: 'Core product directory schema and verification pipeline.',
      },
      {
        phase: 'Community Feed',
        status: 'In Progress',
        summary: 'Structured discussion threads and verified customer badge validation.',
      },
    ],
    links: {
      live: 'https://product.forum',
    },
  },
  {
    slug: 'gitfc',
    name: 'GitFC',
    description:
      'A gamified GitHub contributions experience that makes developer activity more engaging and visual.',
    category: 'Developer Tools',
    url: 'https://gitfc.vercel.app/',
    status: 'live',
    order: 3,
    id: 'prod-03',
    division: 'Z-03',
    divisionSlug: 'products',
    tagline: 'Transform GitHub developer profiles into collectible football-style player cards.',
    longDescription:
      'GitFC bridges the gap between developer metrics and collectible sports cards. By analyzing public GitHub activity, it computes specialized player stats (e.g., Velocity, Defending codebase, Polyglot rating) and renders printable vector player cards.',
    featured: true,
    featuredOrder: 3,
    tags: ['Developer Tool', 'Card Generator', 'GitHub API', 'SVG Rendering'],
    startedAt: '2026-Q1',
    updatedAt: '2026-Q4',
    theme: {
      accent: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
    },
    problem:
      'Standard developer resumes and GitHub overview tabs are visually dry and fail to highlight specialized craftsmanship or open-source momentum in a shareable format.',
    solution:
      'An automated card engine that pulls GitHub GraphQL stats, normalizes metrics into rating scales, and generates shareable high-res SVG and PNG cards.',
    architectureNotes: [
      'GitHub GraphQL API caching layer with rate-limit dampening',
      'Dynamic OpenGraph and SVG card generator powered by @vercel/og',
      'Downloadable high-DPI export for physical print and stickers',
    ],
    roadmap: [
      {
        phase: 'V1 Generator',
        status: 'Shipped',
        summary: 'Core card renderer with 3 classic trading card themes.',
      },
      {
        phase: 'Team Decks',
        status: 'In Progress',
        summary: 'Team and organization rosters comparing repository contributors.',
      },
    ],
    links: {
      live: 'https://gitfc.vercel.app/',
      repo: 'https://github.com/ShreyashSrivastavaa/gitfc',
    },
  },
];

/**
 * Maps a Prisma database product row to the application's ProductVenture interface.
 * Merges with static config if available to preserve technical architecture notes.
 */
function mapDbProductToVenture(dbProduct: {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  url: string;
  status: DbProductStatus;
  sortOrder: number;
}): ProductVenture {
  const staticFallback = productsData.find((p) => p.slug === dbProduct.slug);
  const status: ProductStatus = dbProduct.status === 'LIVE' ? 'live' : 'coming-soon';

  return {
    ...(staticFallback ?? {
      id: dbProduct.id,
      division: 'Z-03' as const,
      divisionSlug: 'products' as const,
      tagline: dbProduct.description,
      tags: [dbProduct.category],
      featured: true,
      problem: '',
      solution: '',
    }),
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description,
    category: dbProduct.category,
    url: dbProduct.url,
    status,
    order: dbProduct.sortOrder,
    links: {
      ...staticFallback?.links,
      live: dbProduct.url,
    },
  };
}

/**
 * Internal loader that fetches products from PostgreSQL via Prisma.
 * Catches any connection error and safely falls back to static config.
 */
async function fetchProductsFromDatabase(): Promise<ProductVenture[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        status: {
          in: [DbProductStatus.LIVE, DbProductStatus.COMING_SOON],
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(mapDbProductToVenture);
    }
  } catch (error) {
    // Server-side only logging: prevents client crashes during DB cold starts or offline state
    console.error('[getProducts] Database unavailable or unmigrated. Serving static fallback config:', error);
  }

  // Resilient fallback to static Phase 1 data
  return [...productsData].sort((a, b) => a.order - b.order);
}

/**
 * Cached public query for products.
 * Uses Next.js incremental cache (tag: 'products', 60-second background revalidation)
 * so homepage and directory pages load instantly without blocking on database latency.
 */
export const getProducts = unstable_cache(
  fetchProductsFromDatabase,
  ['zenith-district-products-list'],
  {
    revalidate: 60,
    tags: ['products'],
  }
);

/**
 * Retrieves a single product by slug, querying the DB with safe static fallback.
 */
export async function getProductBySlug(slug: string): Promise<ProductVenture | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (dbProduct) {
      return mapDbProductToVenture(dbProduct);
    }
  } catch (error) {
    console.error(`[getProductBySlug] DB query failed for slug "${slug}". Serving static fallback:`, error);
  }

  const staticProduct = productsData.find((p) => p.slug === slug);
  return staticProduct ?? null;
}
