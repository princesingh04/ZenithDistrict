import React from 'react';
import { Product } from '@/data/products';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isLive = product.status === 'live' || (product.status as string) === 'Live';

  // Format order indicator (e.g. "01", "02")
  const orderIndex = String(product.order ?? 1).padStart(2, '0');

  // Extract a clean display hostname for subtle typographic context (e.g., "ihatelovepdf.com")
  let cleanDomain = '';
  try {
    cleanDomain = new URL(product.url).hostname.replace(/^www\./, '');
  } catch {
    cleanDomain = product.url;
  }

  return (
    <article className="group border border-[var(--border-color)] hover:border-[var(--signal)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)] transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between min-h-[320px] rounded-none focus-within:ring-2 focus-within:ring-[var(--signal)]">
      {/* Top Metadata: Category & LIVE Badge */}
      <div>
        <div className="flex items-center justify-between pb-4 hairline-border-b gap-2">
          <span className="font-mono-tag text-[10px] tracking-wider text-[var(--stone)] px-2 py-0.5 border border-[var(--border-color)] bg-[var(--surface-elevated)] truncate max-w-[200px]">
            {product.category}
          </span>

          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono-tag text-[10px] tracking-wider uppercase border border-[var(--border-color)] bg-[var(--surface-elevated)] text-[var(--text-primary)] shrink-0 select-none">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                aria-hidden="true"
              />
              <span>LIVE</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono-tag text-[10px] tracking-wider uppercase border border-[var(--border-color)] bg-[var(--surface-elevated)] text-[var(--stone)] shrink-0 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--stone)]" aria-hidden="true" />
              <span>COMING SOON</span>
            </span>
          )}
        </div>

        {/* Typographic Domain & Index Accents (No external images) */}
        <div className="pt-5 pb-3 flex items-center justify-between text-[11px] font-mono-tag text-[var(--stone)]">
          <span>{`${orderIndex} // PRODUCT`}</span>
          <span className="lowercase text-[var(--muted-text)] font-sans text-xs">
            {cleanDomain}
          </span>
        </div>

        {/* Product Name & Description */}
        <div className="space-y-2.5">
          <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text-primary)] group-hover:text-[var(--signal)] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Bottom CTA: Explore Product */}
      <div className="pt-4 mt-6 hairline-border-t">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-between w-full font-mono-tag text-xs tracking-wider uppercase text-[var(--text-primary)] group-hover:text-[var(--signal)] transition-colors focus-visible:outline-none"
          aria-label={`Explore ${product.name} (${cleanDomain}) - opens in a new tab`}
        >
          <span className="font-medium">Explore Product</span>
          <ArrowUpRight
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  );
}
