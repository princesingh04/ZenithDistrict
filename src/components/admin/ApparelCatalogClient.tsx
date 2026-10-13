'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApparelProduct } from '@/data/types';
import { PlusCircle, Trash2, ExternalLink, RefreshCw, Copy, Check, Edit3 } from 'lucide-react';

function getAvailabilityBadge(status: string) {
  const s = status.toLowerCase();
  if (s === 'available') {
    return {
      dot: 'bg-emerald-500',
      badge: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/5',
      label: status,
    };
  }
  if (s === 'preorder') {
    return {
      dot: 'bg-amber-500 animate-pulse',
      badge: 'text-amber-600 dark:text-amber-400 border-amber-500/25 bg-amber-500/5',
      label: status,
    };
  }
  if (s === 'sampling') {
    return {
      dot: 'bg-[var(--signal)]',
      badge: 'text-[var(--signal)] border-[var(--signal)]/25 bg-[var(--signal)]/5',
      label: status,
    };
  }
  return {
    dot: 'bg-[var(--stone)]',
    badge: 'text-[var(--stone)] border-[var(--border-color)] bg-[var(--surface-elevated)]',
    label: status,
  };
}

interface ApparelCatalogClientProps {
  initialProducts: (ApparelProduct & { isCustom?: boolean })[];
}

export function ApparelCatalogClient({ initialProducts }: ApparelCatalogClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete custom garment "${slug}"?`)) return;

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.slug !== slug));
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete product.');
      }
    } catch {
      alert('Network error while deleting product.');
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleCopyTs = (p: ApparelProduct) => {
    const tsCode = JSON.stringify(p, null, 2);
    navigator.clipboard.writeText(tsCode);
    setCopiedSlug(p.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs font-mono-tag text-[var(--stone)] uppercase">
          TOTAL ACTIVE GARMENTS: <span className="text-[var(--text-primary)] font-bold">{products.length}</span>
        </div>

        <Link
          href="/admin/apparel/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-mono-tag tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>ADD NEW GARMENT SPEC</span>
        </Link>
      </div>

      {/* Grid of Garment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.slug}
            className="group border border-[var(--border-color)] bg-[var(--surface-card)] flex flex-col justify-between hover:border-[var(--text-primary)]/40 transition-all overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-5 sm:p-6 border-b border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-[9px] uppercase tracking-widest text-[var(--stone)]">SPEC //</span>
                  <span className="font-bold text-[var(--text-primary)] group-hover:text-[var(--signal)] tracking-wider uppercase transition-colors">
                    {p.code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {p.isCustom ? (
                    <span className="px-2 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      DYNAMIC
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-[var(--surface-elevated)] text-[var(--stone)] border border-[var(--border-color)]">
                      BASELINE
                    </span>
                  )}
                  {(() => {
                    const conf = getAvailabilityBadge(p.availability);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border ${conf.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                        <span>{conf.label}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div>
                <h3 className="font-sans font-medium text-lg text-[var(--text-primary)] tracking-tight group-hover:text-[var(--signal)] transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-[var(--muted-text)] line-clamp-2 mt-1.5 leading-relaxed min-h-[2.5rem]">
                  {p.description}
                </p>
              </div>
            </div>

            {/* Spec Details */}
            <div className="p-5 sm:p-6 space-y-4 text-xs font-mono flex-1">
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                  <span className="text-[var(--stone)] block text-[9px] font-mono-tag uppercase tracking-wider mb-0.5">Silhouette</span>
                  <span className="text-[var(--text-primary)] font-medium truncate block">{p.silhouette}</span>
                </div>
                <div className="p-2.5 bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                  <span className="text-[var(--stone)] block text-[9px] font-mono-tag uppercase tracking-wider mb-0.5">Print Type</span>
                  <span className="text-[var(--text-primary)] font-medium truncate block">{p.print.type}</span>
                </div>
                <div className="p-2.5 bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                  <span className="text-[var(--stone)] block text-[9px] font-mono-tag uppercase tracking-wider mb-0.5">Fabric</span>
                  <span className="text-[var(--text-primary)] font-medium truncate block">
                    {p.fabric.gsm ? `${p.fabric.gsm} GSM` : 'Unconfirmed'}
                  </span>
                </div>
                <div className="p-2.5 bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                  <span className="text-[var(--stone)] block text-[9px] font-mono-tag uppercase tracking-wider mb-0.5">Price</span>
                  <span className="text-[var(--text-primary)] font-bold block">₹{p.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Colorway Swatches */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <span className="text-[var(--stone)] block text-[9px] font-mono-tag uppercase tracking-wider mb-2">
                  Colorways ({p.colorways.length})
                </span>
                <div className="flex items-center gap-2">
                  {p.colorways.map((cw) => (
                    <div
                      key={cw.id}
                      className="w-5 h-5 border border-[var(--border-color)] rounded-none shrink-0"
                      style={{ backgroundColor: cw.hex }}
                      title={`${cw.label} (${cw.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="px-5 py-3.5 bg-[var(--surface-elevated)]/60 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-[10px] font-mono-tag mt-auto">
              <Link
                href={`/brands/zenith-district/shop/${p.slug}`}
                target="_blank"
                className="px-2 py-1 text-[var(--stone)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border-color)] flex items-center gap-1 transition-all"
                title="Open storefront product page"
              >
                <span>STOREFRONT</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/admin/apparel/new?edit=${p.slug}`}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] hover:text-white hover:bg-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Edit garment specification"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>EDIT SPEC</span>
                </Link>

                <button
                  onClick={() => handleCopyTs(p)}
                  className="p-1.5 text-[var(--stone)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent hover:border-[var(--border-color)] flex items-center transition-all cursor-pointer"
                  title="Copy JSON Spec"
                >
                  {copiedSlug === p.slug ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleDelete(p.slug)}
                  disabled={deletingSlug === p.slug}
                  className="p-1.5 text-[var(--stone)] hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 flex items-center transition-all cursor-pointer disabled:opacity-40"
                  title="Delete product"
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
