import React from 'react';
import { getApparelProducts } from '@/data/apparel';
import { getCustomApparelProducts } from '@/lib/custom-apparel';
import { ApparelCatalogClient } from '@/components/admin/ApparelCatalogClient';

export default async function AdminApparelPage() {
  const all = await getApparelProducts();
  const custom = await getCustomApparelProducts();
  const customSlugs = new Set(custom.map((c) => c.slug));

  const productsWithFlags = all.map((p) => ({
    ...p,
    isCustom: customSlugs.has(p.slug),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6">
        <span className="font-mono-tag text-[10px] text-[var(--stone)] tracking-widest uppercase">
          Z-02 BRANDS // TECHNICAL APPAREL DIVISION
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] mt-1">
          Garment Catalog & Specifications
        </h1>
        <p className="text-xs text-[var(--muted-text)] mt-2 max-w-2xl leading-relaxed">
          Manage heavyweight physical garment silhouettes, fabric compositions, vector coordinate prints, and localized Qikink POD fulfillment parameters.
        </p>
      </div>

      <ApparelCatalogClient initialProducts={productsWithFlags} />
    </div>
  );
}
