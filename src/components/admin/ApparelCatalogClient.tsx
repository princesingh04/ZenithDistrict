'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApparelProduct } from '@/data/types';
import { PlusCircle, Trash2, ExternalLink, RefreshCw, Copy, Check, Edit3 } from 'lucide-react';

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
            className="border border-[var(--border-color)] bg-[var(--surface-card)] flex flex-col justify-between hover:border-[var(--signal)] transition-colors"
          >
            {/* Card Header */}
            <div className="p-5 border-b border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[var(--signal)] tracking-wider">{p.code}</span>
                <div className="flex items-center gap-2">
                  {p.isCustom ? (
                    <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      DYNAMIC
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-[var(--surface-elevated)] text-[var(--stone)] border border-[var(--border-color)]">
                      BASELINE
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]">
                    {p.availability}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-sans font-medium text-base text-[var(--text-primary)]">{p.name}</h3>
                <p className="text-xs text-[var(--muted-text)] line-clamp-2 mt-1 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>

            {/* Spec Details */}
            <div className="p-5 space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[var(--stone)] block text-[10px] font-mono-tag uppercase">Silhouette</span>
                  <span className="text-[var(--text-primary)] truncate block">{p.silhouette}</span>
                </div>
                <div>
                  <span className="text-[var(--stone)] block text-[10px] font-mono-tag uppercase">Print Type</span>
                  <span className="text-[var(--text-primary)] truncate block">{p.print.type}</span>
                </div>
                <div>
                  <span className="text-[var(--stone)] block text-[10px] font-mono-tag uppercase">Fabric</span>
                  <span className="text-[var(--text-primary)] truncate block">
                    {p.fabric.gsm ? `${p.fabric.gsm} GSM` : 'Unconfirmed'}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--stone)] block text-[10px] font-mono-tag uppercase">Price</span>
                  <span className="text-[var(--text-primary)] font-bold block">₹{p.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Colorway Swatches */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <span className="text-[var(--stone)] block text-[10px] font-mono-tag uppercase mb-1.5">
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
            <div className="p-3 bg-[var(--surface-elevated)] border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono-tag">
              <Link
                href={`/brands/zenith-district/shop/${p.slug}`}
                target="_blank"
                className="text-[var(--stone)] hover:text-[var(--signal)] flex items-center gap-1 transition-colors"
              >
                <span>STOREFRONT</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/apparel/new?edit=${p.slug}`}
                  className="px-2 py-1 text-[var(--signal)] hover:text-white border border-[var(--signal)]/40 hover:bg-[var(--signal)] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Edit garment specification"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>EDIT</span>
                </Link>

                <button
                  onClick={() => handleCopyTs(p)}
                  className="px-2 py-1 text-[var(--stone)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--text-primary)] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy JSON Spec"
                >
                  {copiedSlug === p.slug ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSlug === p.slug ? 'COPIED' : 'COPY'}</span>
                </button>

                {p.isCustom && (
                  <button
                    onClick={() => handleDelete(p.slug)}
                    disabled={deletingSlug === p.slug}
                    className="px-2 py-1 text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-500 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                    title="Delete product"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>DELETE</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
