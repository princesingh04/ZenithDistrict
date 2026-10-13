'use client';

import React, { useState } from 'react';
import { ProductVenture } from '@/data/types';
import { ProductCard } from '@/components/products/ProductCard';

interface ProductsFilterViewProps {
  products: ProductVenture[];
}

export function ProductsFilterView({ products }: ProductsFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Category Filters Bar */}
      <div className="p-4 border border-[var(--border-color)] bg-[var(--surface-elevated)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono-tag text-[10px] text-[var(--stone)] mr-1">
            CATEGORY:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 font-mono-tag text-xs border rounded-none transition-colors ${
                selectedCategory === cat
                  ? 'border-[var(--signal)] bg-[var(--signal)]/10 text-[var(--signal)] font-medium'
                  : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--stone)]'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="font-mono-tag text-[10px] text-[var(--stone)]">
          {filteredProducts.length} ACTIVE {filteredProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-12 text-center border border-dashed border-[var(--border-color)] font-mono-tag text-xs text-[var(--stone)]">
          NO SOFTWARE PRODUCTS MATCHED CURRENT FILTER CRITERIA
        </div>
      )}
    </div>
  );
}
