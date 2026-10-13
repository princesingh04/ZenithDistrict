'use client';

import React, { useState } from 'react';
import { ProductVenture, LabExperiment, VentureStatus } from '@/data/types';
import { Copy, Check, Box, FlaskConical, ExternalLink, PlusCircle } from 'lucide-react';

interface VenturesRegistryClientProps {
  products: ProductVenture[];
  labs: LabExperiment[];
}

export function VenturesRegistryClient({ products, labs }: VenturesRegistryClientProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'labs'>('products');

  // Generator form states
  const [genType, setGenType] = useState<'product' | 'lab'>('product');
  const [name, setName] = useState('New Platform Utility');
  const [slug, setSlug] = useState('new-platform-utility');
  const [status, setStatus] = useState<VentureStatus>('Building');
  const [category, setCategory] = useState('Developer Tools');
  const [tagline, setTagline] = useState('High-performance client-side utility for web applications.');
  const [desc, setDesc] = useState('Detailed architectural description of the venture problem space and implementation.');
  const [tags, setTags] = useState('TypeScript, WASM, Developer Tool');
  const [problemHypothesis, setProblemHypothesis] = useState('Developers face high latency and privacy leakage with remote cloud converters.');
  const [solutionMilestone, setSolutionMilestone] = useState('Browser-native WebAssembly pipeline with zero external server transit.');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
  };

  const generateSnippet = () => {
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (genType === 'product') {
      const obj = {
        id: `prod-${Date.now().toString().slice(-4)}`,
        slug,
        name,
        division: 'Z-03',
        divisionSlug: 'products',
        category,
        status,
        tagline,
        description: desc,
        featured: true,
        tags: tagList,
        startedAt: '2026-Q4',
        problem: problemHypothesis,
        solution: solutionMilestone,
        architectureNotes: [
          'Sub-5ms execution budget on V8 isolates',
          'Zero external database required for client-side processing',
        ],
        links: {
          live: `https://${slug}.zenithdistrict.com`,
          repo: `https://github.com/princesingh04/${slug}`,
        },
      };
      return `// Append to src/data/products.ts\n${JSON.stringify(obj, null, 2)},`;
    }

    const labObj = {
      id: `lab-${Date.now().toString().slice(-4)}`,
      slug,
      name,
      division: 'Z-04',
      divisionSlug: 'labs',
      status,
      tagline,
      description: desc,
      featured: false,
      tags: tagList,
      startedAt: '2026-Q4',
      hypothesis: problemHypothesis,
      learnings: ['Initial benchmark proves feasible within client memory budget.'],
      nextMilestone: solutionMilestone,
      graduationCriteria: [
        'Sustained query latency under 50ms',
        'Proven utility across at least two internal projects',
      ],
    };
    return `// Append to src/data/labs.ts\n${JSON.stringify(labObj, null, 2)},`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-3">
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
                className="border border-[var(--border-color)] bg-[var(--surface-card)] p-5 flex flex-col justify-between space-y-4 hover:border-[var(--signal)] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[var(--signal)]">{p.id}</span>
                    <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                      {p.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-base text-[var(--text-primary)]">{p.name}</h3>
                    <p className="text-xs text-[var(--muted-text)] mt-1">{p.tagline}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-[var(--stone)] bg-[var(--bg-page)] px-1.5 py-0.5 border border-[var(--border-color)]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono-tag">
                  <span className="text-[var(--stone)]">{p.category}</span>
                  <a
                    href={`/products/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--signal)] hover:underline flex items-center gap-1"
                  >
                    <span>VIEW SPEC</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          : labs.map((l) => (
              <div
                key={l.slug}
                className="border border-[var(--border-color)] bg-[var(--surface-card)] p-5 flex flex-col justify-between space-y-4 hover:border-[var(--signal)] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#FF4F1F]">{l.id}</span>
                    <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                      {l.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-base text-[var(--text-primary)]">{l.name}</h3>
                    <p className="text-xs text-[var(--muted-text)] mt-1">{l.tagline}</p>
                  </div>
                  <div className="p-2.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--stone)]">
                    <span className="text-[9px] uppercase font-mono-tag block text-[var(--stone)] mb-0.5">Hypothesis:</span>
                    <p className="line-clamp-2">{l.hypothesis}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono-tag">
                  <span className="text-[var(--stone)]">NEXT: {l.nextMilestone}</span>
                  <a
                    href={`/labs/${l.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF4F1F] hover:underline flex items-center gap-1"
                  >
                    <span>VIEW LAB</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
      </div>

      {/* Interactive Venture Snippet Generator */}
      <div className="border border-[var(--border-color)] bg-[var(--surface-elevated)] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[var(--signal)]" />
            <h2 className="text-sm font-mono-tag uppercase tracking-wider text-[var(--text-primary)]">
              VENTURE REGISTRATION SPEC GENERATOR
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setGenType('product')}
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

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-[var(--stone)]">
            Generates typed TypeScript definition ready for direct commit.
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-mono-tag uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'COPIED TO CLIPBOARD' : 'COPY TS CODE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
