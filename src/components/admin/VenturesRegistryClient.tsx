'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductVenture, LabExperiment, VentureStatus } from '@/data/types';
import { Copy, Check, Box, FlaskConical, ExternalLink, PlusCircle, Image as ImageIcon, Edit3, RotateCcw, Save, AlertCircle, Trash2 } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

function getVentureStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === 'live' || s === 'shipped') {
    return {
      dot: 'bg-emerald-500',
      badge: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/5',
      label: status,
    };
  }
  if (s === 'building') {
    return {
      dot: 'bg-amber-500 animate-pulse',
      badge: 'text-amber-600 dark:text-amber-400 border-amber-500/25 bg-amber-500/5',
      label: status,
    };
  }
  if (s === 'beta' || s === 'alpha') {
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

interface VenturesRegistryClientProps {
  products: ProductVenture[];
  labs: LabExperiment[];
}

export function VenturesRegistryClient({ products, labs }: VenturesRegistryClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'labs'>('products');

  // Generator form states
  const [genType, setGenType] = useState<'product' | 'lab'>('product');
  const [name, setName] = useState('New Platform Utility');
  const [slug, setSlug] = useState('new-platform-utility');
  const [status, setStatus] = useState<VentureStatus>('Building');
  const [category, setCategory] = useState('Developer Tools');
  const [tagline, setTagline] = useState('High-performance client-side utility for web applications.');
  const [desc, setDesc] = useState('Detailed architectural description of the venture problem space and implementation.');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop');
  const [tags, setTags] = useState('TypeScript, WASM, Developer Tool');
  const [problemHypothesis, setProblemHypothesis] = useState('Developers face high latency and privacy leakage with remote cloud converters.');
  const [solutionMilestone, setSolutionMilestone] = useState('Browser-native WebAssembly pipeline with zero external server transit.');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingVentureSlug, setDeletingVentureSlug] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDeleteVenture = async (type: 'product' | 'lab', targetSlug: string, targetName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${targetName}"? This will remove it from the ventures registry and live site.`)) return;

    setDeletingVentureSlug(targetSlug);
    try {
      const res = await fetch(`/api/admin/ventures?type=${type}&slug=${encodeURIComponent(targetSlug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (editingTarget === targetName) {
          handleResetGenerator();
        }
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete venture.');
      }
    } catch {
      alert('Network error while deleting venture.');
    } finally {
      setDeletingVentureSlug(null);
    }
  };

  const handleEditProduct = (p: ProductVenture) => {
    setGenType('product');
    setName(p.name);
    setSlug(p.slug);
    setStatus(p.status);
    setCategory(p.category);
    setTagline(p.tagline);
    setDesc(p.longDescription || p.description);
    setTags(p.tags.join(', '));
    setProblemHypothesis(p.problem);
    setSolutionMilestone(p.solution);
    setBannerImage(p.bannerImage || '');
    setEditingTarget(`Z-03 // ${p.name}`);
    document.getElementById('venture-generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditLab = (l: LabExperiment) => {
    setGenType('lab');
    setName(l.name);
    setSlug(l.slug);
    setStatus(l.status);
    setTagline(l.tagline);
    setDesc(l.description);
    setTags(l.tags.join(', '));
    setProblemHypothesis(l.hypothesis);
    setSolutionMilestone(l.nextMilestone);
    setBannerImage(l.bannerImage || '');
    setEditingTarget(`Z-04 // ${l.name}`);
    document.getElementById('venture-generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetGenerator = () => {
    setName('New Platform Utility');
    setSlug('new-platform-utility');
    setStatus('Building');
    setCategory('Developer Tools');
    setTagline('High-performance client-side utility for web applications.');
    setDesc('Detailed architectural description of the venture problem space and implementation.');
    setBannerImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop');
    setTags('TypeScript, WASM, Developer Tool');
    setProblemHypothesis('Developers face high latency and privacy leakage with remote cloud converters.');
    setSolutionMilestone('Browser-native WebAssembly pipeline with zero external server transit.');
    setEditingTarget(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
  };

  const buildVentureObject = () => {
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (genType === 'product') {
      const existing = products.find((p) => p.slug === slug);
      return {
        id: existing?.id || `prod-${Date.now().toString().slice(-4)}`,
        slug: slug.trim(),
        name: name.trim(),
        division: 'Z-03',
        divisionSlug: 'products',
        category: category.trim(),
        status,
        tagline: tagline.trim(),
        description: desc.trim(),
        bannerImage: bannerImage.trim() || undefined,
        featured: existing?.featured ?? true,
        featuredOrder: existing?.featuredOrder ?? 2,
        tags: tagList,
        startedAt: existing?.startedAt || '2026-Q4',
        updatedAt: '2026-Q4',
        problem: problemHypothesis.trim(),
        solution: solutionMilestone.trim(),
        architectureNotes: existing?.architectureNotes || [
          'Sub-5ms execution budget on V8 isolates',
          'Zero external database required for client-side processing',
        ],
        roadmap: existing?.roadmap || [
          {
            phase: 'Phase 1: Core Operations',
            status: 'In Progress',
            summary: 'Initial production milestone.',
          },
        ],
        links: existing?.links || {
          live: `https://${slug.trim()}.zenithdistrict.com`,
          repo: `https://github.com/princesingh04/${slug.trim()}`,
        },
      } as ProductVenture;
    }

    const existing = labs.find((l) => l.slug === slug);
    return {
      id: existing?.id || `lab-${Date.now().toString().slice(-4)}`,
      slug: slug.trim(),
      name: name.trim(),
      division: 'Z-04',
      divisionSlug: 'labs',
      status,
      tagline: tagline.trim(),
      description: desc.trim(),
      featured: false,
      tags: tagList,
      startedAt: existing?.startedAt || '2026-Q4',
      hypothesis: problemHypothesis.trim(),
      learnings: existing?.learnings || ['Initial benchmark proves feasible within client memory budget.'],
      nextMilestone: solutionMilestone.trim(),
      graduationCriteria: existing?.graduationCriteria || [
        'Sustained query latency under 50ms',
        'Proven utility across at least two internal projects',
      ],
    } as LabExperiment;
  };

  const handleSaveVenture = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const ventureData = buildVentureObject();
      const res = await fetch('/api/admin/ventures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: genType, data: ventureData }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(resData.error || 'Failed to save venture specification.');
      }
    } catch {
      setErrorMsg('Network error communicating with administrative API.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateSnippet = () => {
    const obj = buildVentureObject();
    if (genType === 'product') {
      return `// Append to src/data/products.ts\n${JSON.stringify(obj, null, 2)},`;
    }
    return `// Append to src/data/labs.ts\n${JSON.stringify(obj, null, 2)},`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-3 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 pb-2 text-xs font-mono-tag tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'border-[var(--signal)] text-[var(--signal)] font-bold'
              : 'border-transparent text-[var(--stone)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Z-03 SOFTWARE PRODUCTS ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('labs')}
          className={`flex items-center gap-2 pb-2 text-xs font-mono-tag tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
            activeTab === 'labs'
              ? 'border-[var(--signal)] text-[var(--signal)] font-bold'
              : 'border-transparent text-[var(--stone)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Z-04 LABS HYPOTHESES ({labs.length})</span>
        </button>
      </div>

      {/* Ventures Cards Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'products'
          ? products.map((p) => (
              <div
                key={p.slug}
                className="group border border-[var(--border-color)] bg-[var(--surface-card)] flex flex-col justify-between hover:border-[var(--text-primary)]/40 transition-all overflow-hidden"
              >
                {/* Banner Preview Area */}
                {p.bannerImage ? (
                  <div className="relative w-full aspect-[16/9] bg-[var(--surface-elevated)] border-b border-[var(--border-color)] overflow-hidden group/img">
                    <img
                      src={p.bannerImage}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[25%] contrast-[105%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[var(--bg-page)]/85 backdrop-blur-md border border-[var(--border-color)] text-[8px] font-mono uppercase tracking-widest text-[var(--stone)] flex items-center gap-1.5">
                      <ImageIcon className="w-2.5 h-2.5 text-[var(--signal)]" />
                      <span>SHOWCASE ASSET</span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-md text-[9px] font-mono tracking-wider text-white/90 uppercase border border-white/10">
                      {p.category}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-[16/9] bg-[var(--surface-elevated)] border-b border-[var(--border-color)] overflow-hidden flex flex-col items-center justify-center p-4">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 flex flex-col items-center gap-1 text-[var(--stone)]">
                      <Box className="w-6 h-6 stroke-[1.2] text-[var(--stone)] group-hover:text-[var(--signal)] transition-colors" />
                      <span className="text-[9px] font-mono tracking-widest uppercase text-[var(--stone)]">// NO SHOWCASE ASSET //</span>
                    </div>
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-[var(--stone)]/40">+</div>
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-[var(--stone)]/40">+</div>
                    <div className="absolute bottom-2 left-2 text-[8px] font-mono text-[var(--stone)]/40">+</div>
                    <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[var(--stone)]/40">+</div>
                  </div>
                )}

                {/* Card Main Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Telemetry Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="text-[9px] uppercase tracking-widest text-[var(--stone)]">SPEC //</span>
                        <span className="font-bold tracking-wider text-[var(--text-primary)] group-hover:text-[var(--signal)] transition-colors uppercase">
                          {p.id}
                        </span>
                      </div>
                      {(() => {
                        const conf = getVentureStatusStyle(p.status);
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border ${conf.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                            <span>{conf.label}</span>
                          </span>
                        );
                      })()}
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="font-sans font-medium text-lg text-[var(--text-primary)] tracking-tight group-hover:text-[var(--signal)] transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[var(--muted-text)] leading-relaxed mt-1.5 line-clamp-2 min-h-[2.5rem]">
                        {p.tagline}
                      </p>
                    </div>

                    {/* Clean Tags Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.tags.map((t) => {
                        const cleanTag = t.replace(/^#/, '').trim();
                        return (
                          <span
                            key={cleanTag}
                            className="text-[10px] font-mono text-[var(--stone)] bg-[var(--surface-elevated)] px-2 py-0.5 border border-[var(--border-color)] group-hover:border-[var(--stone)]/30 transition-colors uppercase tracking-wider"
                          >
                            {cleanTag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Architectural Actions Footer */}
                <div className="px-5 py-3 bg-[var(--surface-elevated)]/60 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-[10px] font-mono-tag mt-auto">
                  <div className="flex items-center gap-1.5 text-[var(--stone)] truncate">
                    <span className="w-1.5 h-1.5 bg-[var(--stone)]/40 rounded-full" />
                    <span className="uppercase tracking-wider truncate max-w-[90px] sm:max-w-[130px]">{p.category}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(p)}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] hover:text-white hover:bg-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Edit venture specification"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>EDIT SPEC</span>
                    </button>
                    <a
                      href={`/products/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-[var(--stone)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent hover:border-[var(--border-color)] flex items-center transition-all"
                      title="Open live venture in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteVenture('product', p.slug, p.name)}
                      disabled={deletingVentureSlug === p.slug}
                      className="p-1.5 text-[var(--stone)] hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 flex items-center transition-all cursor-pointer disabled:opacity-40"
                      title="Delete venture"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          : labs.map((l) => (
              <div
                key={l.slug}
                className="group border border-[var(--border-color)] bg-[var(--surface-card)] flex flex-col justify-between hover:border-[var(--text-primary)]/40 transition-all overflow-hidden"
              >
                {/* Architectural Technical Slate */}
                <div className="relative w-full py-3.5 px-5 bg-[var(--surface-elevated)] border-b border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-[#FF4F1F]" />
                    <span className="text-[10px] font-mono tracking-widest text-[var(--stone)] uppercase">LAB R&D //</span>
                    <span className="text-[11px] font-mono font-bold text-[#FF4F1F] tracking-wider uppercase">
                      {l.id}
                    </span>
                  </div>
                  {(() => {
                    const conf = getVentureStatusStyle(l.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border ${conf.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
                        <span>{conf.label}</span>
                      </span>
                    );
                  })()}
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-sans font-medium text-lg text-[var(--text-primary)] tracking-tight group-hover:text-[#FF4F1F] transition-colors">
                        {l.name}
                      </h3>
                      <p className="text-xs text-[var(--muted-text)] leading-relaxed mt-1.5 line-clamp-2 min-h-[2.5rem]">
                        {l.tagline}
                      </p>
                    </div>

                    {/* Hypothesis Callout */}
                    <div className="p-3 bg-[var(--surface-elevated)] border-l-2 border-[#FF4F1F] border-y border-r border-[var(--border-color)] font-mono text-[11px] space-y-1">
                      <span className="text-[9px] uppercase font-mono-tag block text-[var(--stone)] tracking-widest">
                        Working Hypothesis:
                      </span>
                      <p className="text-[11px] text-[var(--text-primary)] leading-relaxed line-clamp-3 italic">
                        "{l.hypothesis}"
                      </p>
                    </div>
                  </div>

                  {/* Next Milestone */}
                  <div className="pt-2 flex items-center gap-2 text-[10px] font-mono tracking-wider text-[var(--stone)]">
                    <span className="text-[#FF4F1F] font-bold">➔</span>
                    <span className="truncate">
                      NEXT: <span className="text-[var(--text-primary)] font-medium">{l.nextMilestone}</span>
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 bg-[var(--surface-elevated)]/50 border-t border-[var(--border-color)] flex items-center justify-between gap-2 text-[10px] font-mono-tag mt-auto">
                  <span className="text-[var(--stone)] truncate uppercase tracking-widest text-[9px]">
                    DIVISION // Z-04
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditLab(l)}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)] hover:text-white hover:bg-[#FF4F1F] hover:border-[#FF4F1F] border border-[var(--border-color)] flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Edit experiment specification"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>EDIT SPEC</span>
                    </button>
                    <a
                      href={`/labs/${l.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-[var(--stone)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent hover:border-[var(--border-color)] flex items-center transition-all"
                      title="View lab page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteVenture('lab', l.slug, l.name)}
                      disabled={deletingVentureSlug === l.slug}
                      className="p-1.5 text-[var(--stone)] hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 flex items-center transition-all cursor-pointer disabled:opacity-40"
                      title="Delete experiment"
                      aria-label={`Delete ${l.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Interactive Venture Snippet Generator & Editor */}
      <div id="venture-generator" className="border border-[var(--border-color)] bg-[var(--surface-elevated)] p-6 space-y-6 scroll-mt-24">
        {editingTarget && (
          <div className="p-3 bg-[var(--signal)]/10 border border-[var(--signal)]/30 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse" />
              <span className="font-bold text-[var(--signal)]">CURRENTLY EDITING:</span>
              <span className="text-[var(--text-primary)] truncate">{editingTarget}</span>
            </div>
            <button
              type="button"
              onClick={handleResetGenerator}
              className="text-[10px] uppercase font-mono-tag text-[var(--stone)] hover:text-[var(--text-primary)] underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to New Venture</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <PlusCircle className="w-4 h-4 text-[var(--signal)] shrink-0" />
            <h2 className="text-sm font-mono-tag uppercase tracking-wider text-[var(--text-primary)] truncate">
              {editingTarget ? `SPECIFICATION EDITOR // ${editingTarget}` : 'VENTURE REGISTRATION SPEC GENERATOR'}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setGenType('product');
                setEditingTarget(null);
              }}
              className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                genType === 'product'
                  ? 'bg-[var(--signal)] text-white'
                  : 'border border-[var(--border-color)] text-[var(--stone)]'
              }`}
            >
              Z-03 PRODUCT
            </button>
            <button
              onClick={() => setGenType('lab')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                genType === 'lab'
                  ? 'bg-[#FF4F1F] text-white'
                  : 'border border-[var(--border-color)] text-[var(--stone)]'
              }`}
            >
              Z-04 LAB
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as VentureStatus)}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
            >
              <option value="Idea">Idea</option>
              <option value="Exploring">Exploring</option>
              <option value="Building">Building</option>
              <option value="Beta">Beta</option>
              <option value="Live">Live</option>
              <option value="Venture">Venture</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
            />
          </div>
        </div>

        {/* Banner Image Upload & Live Preview (For Software Products) */}
        {genType === 'product' && (
          <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] font-mono-tag uppercase text-[var(--stone)]">
                Banner Asset Presets
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBannerImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')}
                  className="text-[10px] text-[var(--stone)] hover:text-[var(--signal)] underline cursor-pointer"
                >
                  Preset: Cloud Architecture
                </button>
                <button
                  type="button"
                  onClick={() => setBannerImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop')}
                  className="text-[10px] text-[var(--stone)] hover:text-[var(--signal)] underline cursor-pointer"
                >
                  Preset: Code Terminal
                </button>
              </div>
            </div>

            <ImageUploadField
              value={bannerImage}
              onChange={setBannerImage}
              label="UI / Architectural Showcase Banner"
              hint="Upload local screenshot/banner (PNG/JPG/WEBP/SVG up to 8MB) or paste an external asset URL"
              aspectRatio="aspect-21/9"
              placeholder="https://... or upload local banner asset"
            />
          </div>
        )}

        <div className="text-xs font-mono space-y-2">
          <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)]">
            {genType === 'product' ? 'Problem Statement' : 'Research Hypothesis'}
          </label>
          <textarea
            rows={2}
            value={problemHypothesis}
            onChange={(e) => setProblemHypothesis(e.target.value)}
            className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
          <div className="text-[11px] font-mono text-[var(--stone)]">
            {editingTarget
              ? `Currently modifying specification for: ${editingTarget}`
              : 'Save updates directly to registry or copy typed TS definition.'}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-mono-tag uppercase tracking-wider hover:border-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'COPIED' : 'COPY TS'}</span>
            </button>

            {editingTarget && (
              <button
                type="button"
                onClick={() => handleDeleteVenture(genType, slug, name)}
                disabled={deletingVentureSlug === slug}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 border border-red-500/40 text-red-500 hover:bg-red-500/10 text-xs font-mono-tag uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Delete this venture"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingVentureSlug === slug ? 'DELETING...' : 'DELETE'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveVenture}
              disabled={submitting}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-[var(--signal)] text-white text-xs font-mono-tag uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {submitting ? (
                <span>SAVING...</span>
              ) : savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>SAVED TO REGISTRY</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingTarget ? 'SAVE & UPDATE VENTURE' : 'PUBLISH VENTURE'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
