import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { BrandVenture } from '@/data/types';
import { ArrowRight } from 'lucide-react';

interface BrandsPreviewProps {
  brands?: BrandVenture[];
}

export function BrandsPreview({}: BrandsPreviewProps) {
  return (
    <section
      id="brands-section"
      className="py-20 md:py-32 hairline-border-b scroll-mt-20"
      aria-label="Brands Division Overview"
    >
      <Container>
        <SectionHeader
          index="04"
          title="CONSUMER BRANDS"
          code="Z-02"
          caption="Independent consumer ventures conceived and operated in-house."
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono-tag text-[10px] tracking-wider uppercase border border-[var(--border-color)] bg-[var(--surface-elevated)] text-[var(--text-primary)] select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse" aria-hidden="true" />
              <span>UNDER DEVELOPMENT</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)]">
              Brands, Coming Soon.
            </h3>

            <p className="text-sm md:text-base text-[var(--muted-text)] leading-relaxed">
              We are building brands with a purpose. Our first ventures are taking shape, and this is only the beginning.
            </p>
          </div>

          <Link
            href="/brands"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-color)] hover:border-[var(--signal)] hover:text-[var(--signal)] font-mono-tag text-xs tracking-wider uppercase transition-colors shrink-0"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="pt-8 flex items-center justify-between font-mono-tag text-xs text-[var(--muted-text)] hairline-border-t">
          <span>ONE VENTURE HOUSE. MANY SOVEREIGN BRANDS.</span>
          <span>DISTRICT SECTOR NE</span>
        </div>
      </Container>
    </section>
  );
}
