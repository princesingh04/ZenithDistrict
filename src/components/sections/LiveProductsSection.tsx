import React from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/data/products';

interface LiveProductsSectionProps {
  products: Product[];
  className?: string;
}

export function LiveProductsSection({
  products,
  className = '',
}: LiveProductsSectionProps) {
  return (
    <section
      id="live-products"
      className={`py-20 md:py-32 hairline-border-b scroll-mt-20 ${className}`}
      aria-label="Live Products"
    >
      <Container>
        <SectionHeader
          index="Z-03"
          title="Live Products"
          code="PORTFOLIO"
          caption="Independent software tools built to solve friction with focused engineering."
        />

        {/* Editorial Subline */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10 pb-4 hairline-border-b">
          <p className="font-editorial-italic text-2xl sm:text-3xl text-[var(--text-primary)]">
            Independent products built to solve real problems. Explore what is already live.
          </p>
          <span className="font-mono-tag text-xs text-[var(--stone)] shrink-0">
            DEPLOYED & PUBLIC
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {/* Section Footer */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-tag text-xs text-[var(--muted-text)]">
          <span>ALL PRODUCTS LIVE AND ACCESSIBLE DIRECTLY VIA INDEPENDENT DOMAINS</span>
          <span>DISTRICT SECTOR SW // ZERO ARTIFICIAL METRICS</span>
        </div>
      </Container>
    </section>
  );
}
