import React from 'react';
import { getProducts, getLabs } from '@/lib/content';
import { VenturesRegistryClient } from '@/components/admin/VenturesRegistryClient';

export default async function AdminVenturesPage() {
  const [products, labs] = await Promise.all([getProducts(), getLabs()]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6">
        <span className="font-mono-tag text-[10px] text-[var(--stone)] tracking-widest uppercase">
          Z-03 & Z-04 // DIGITAL VENTURES & R&D REGISTRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] mt-1">
          Ventures Registry & Generator
        </h1>
        <p className="text-xs text-[var(--muted-text)] mt-2 max-w-2xl leading-relaxed">
          Monitor sovereign software platforms, developer tooling infrastructure, and experimental hypotheses undergoing lifecycle testing.
        </p>
      </div>

      <VenturesRegistryClient products={products} labs={labs} />
    </div>
  );
}
