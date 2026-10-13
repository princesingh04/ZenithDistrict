import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductsFilterView } from '@/components/products/ProductsFilterView';
import { getProducts } from '@/data/products';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Live Products // ZenithDistrict (Z-03)',
  description:
    'Independent products built to solve real problems. Explore what is already live.',
  path: '/products',
});

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="py-12 md:py-20 space-y-16">
      <Container>
        <SectionHeader
          index="Z-03"
          title="Live Products"
          code="PORTFOLIO"
          caption="Independent software tools and utilities built to solve specific technical friction."
        />

        <div className="max-w-3xl space-y-4 mb-12">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[var(--text-primary)]">
            Live Products
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted-text)] leading-relaxed">
            Independent products built to solve real problems. Explore what is already live.
          </p>
        </div>

        <ProductsFilterView products={products} />

        <div className="pt-12 hairline-border-t flex items-center justify-between font-mono-tag text-xs text-[var(--stone)]">
          <span>ALL TOOLS CURRENTLY DEPLOYED & IN PUBLIC RELEASE</span>
          <span>DISTRICT SECTOR SW</span>
        </div>
      </Container>
    </div>
  );
}
