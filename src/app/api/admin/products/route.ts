import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  getCustomApparelProducts,
  saveCustomApparelProduct,
  deleteCustomApparelProduct,
} from '@/lib/custom-apparel';
import { getApparelProducts } from '@/data/apparel';
import { ApparelProduct } from '@/data/types';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const all = await getApparelProducts();
  const custom = await getCustomApparelProducts();
  const customSlugs = new Set(custom.map((c) => c.slug));

  const items = all.map((item) => ({
    ...item,
    isCustom: customSlugs.has(item.slug),
  }));

  return NextResponse.json({ products: items });
}

export async function POST(req: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = (await req.json()) as ApparelProduct;

    if (!product.slug || !product.name || !product.code) {
      return NextResponse.json(
        { error: 'Slug, Name, and Code are required.' },
        { status: 400 }
      );
    }

    // Default fallbacks if empty
    product.slug = product.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    product.sortOrder = product.sortOrder || 10;
    product.currency = product.currency || 'INR';

    const result = await saveCustomApparelProduct(product);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save product.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid request payload';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required.' }, { status: 400 });
  }

  const result = await deleteCustomApparelProduct(slug);
  if (!result.success) {
    return NextResponse.json({ error: result.error || 'Failed to delete product.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, deletedSlug: slug });
}
