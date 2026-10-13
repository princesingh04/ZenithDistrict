import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  saveCustomProduct,
  saveCustomLab,
  deleteCustomProduct,
  deleteCustomLab,
} from '@/lib/custom-ventures';
import { getProducts, getLabs } from '@/lib/content';
import { ProductVenture, LabExperiment } from '@/data/types';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [products, labs] = await Promise.all([getProducts(), getLabs()]);
  return NextResponse.json({ products, labs });
}

export async function POST(req: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data || !data.slug || !data.name) {
      return NextResponse.json(
        { error: 'Venture type, name, and slug are required.' },
        { status: 400 }
      );
    }

    if (type === 'product') {
      const res = await saveCustomProduct(data as ProductVenture);
      if (!res.success) {
        return NextResponse.json({ error: res.error || 'Failed to save product.' }, { status: 500 });
      }
      return NextResponse.json({ success: true, product: data });
    } else if (type === 'lab') {
      const res = await saveCustomLab(data as LabExperiment);
      if (!res.success) {
        return NextResponse.json({ error: res.error || 'Failed to save lab.' }, { status: 500 });
      }
      return NextResponse.json({ success: true, lab: data });
    }

    return NextResponse.json({ error: 'Unknown venture type.' }, { status: 400 });
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
  const type = searchParams.get('type');
  const slug = searchParams.get('slug');

  if (!type || !slug) {
    return NextResponse.json({ error: 'Type and slug parameters are required.' }, { status: 400 });
  }

  if (type === 'product') {
    const res = await deleteCustomProduct(slug);
    if (!res.success) return NextResponse.json({ error: res.error }, { status: 500 });
    return NextResponse.json({ success: true, deletedSlug: slug });
  } else if (type === 'lab') {
    const res = await deleteCustomLab(slug);
    if (!res.success) return NextResponse.json({ error: res.error }, { status: 500 });
    return NextResponse.json({ success: true, deletedSlug: slug });
  }

  return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
}
