import { NextResponse } from 'next/server';
import { getProducts } from '@/data/products';

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        data: products.map((p) => ({
          slug: p.slug,
          name: p.name,
          description: p.description,
          category: p.category,
          url: p.url,
          status: p.status,
          order: p.order,
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
