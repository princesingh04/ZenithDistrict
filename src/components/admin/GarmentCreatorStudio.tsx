'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GarmentSilhouette,
  GarmentColorway,
  GarmentView,
  PrintDefinition,
  ApparelProduct,
  ApparelSize,
  ProductAvailability,
} from '@/data/types';
import { GarmentMock } from '@/components/brand/GarmentMock';
import {
  Eye,
  Save,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  Info,
  AlertCircle,
} from 'lucide-react';

const SILHOUETTES: { id: GarmentSilhouette; label: string }[] = [
  { id: 'oversized-tee', label: 'Oversized Tee' },
  { id: 'boxy-cropped-tee', label: 'Boxy Cropped Tee' },
  { id: 'oversized-long-sleeve', label: 'Oversized Long Sleeve' },
  { id: 'oversized-sleeveless', label: 'Oversized Sleeveless' },
];

const PRINT_TYPES: { id: PrintDefinition['type']; label: string; desc: string }[] = [
  { id: 'coordinates', label: 'Coordinates (Sector GPS)', desc: 'Micro-type coordinate grid on chest/back' },
  { id: 'blueprint', label: 'Blueprint (Architectural Cadastre)', desc: 'Architectural section elevations with dimension callouts' },
  { id: 'index', label: 'Index (Numeric Datum)', desc: 'Minimal index numbers and venture code' },
  { id: 'axis', label: 'Axis (Vertical Alignment)', desc: 'Vertical spine line running down garment seam' },
];

const PRESET_COLORS: GarmentColorway[] = [
  { id: 'bone', label: 'Bone', hex: '#F5F2EB', garmentHex: '#F5F2EB' },
  { id: 'ink', label: 'Ink', hex: '#151618', garmentHex: '#151618' },
  { id: 'sand', label: 'Sand', hex: '#D6CEBE', garmentHex: '#D6CEBE' },
  { id: 'washed-grey', label: 'Washed Grey', hex: '#5C5D61', garmentHex: '#5C5D61' },
  { id: 'moss', label: 'Moss', hex: '#485244', garmentHex: '#485244' },
  { id: 'white', label: 'Pure White', hex: '#FFFFFF', garmentHex: '#FFFFFF' },
];

const ALL_SIZES: ApparelSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function GarmentCreatorStudio() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState('Heavyweight Boxy Tee "Datum"');
  const [code, setCode] = useState('ZB-05');
  const [slug, setSlug] = useState('heavyweight-boxy-tee-datum');
  const [silhouette, setSilhouette] = useState<GarmentSilhouette>('oversized-tee');
  const [printType, setPrintType] = useState<PrintDefinition['type']>('coordinates');
  const [frontPlacement, setFrontPlacement] = useState('Left chest: Technical coordinates and sector mark');
  const [backPlacement, setBackPlacement] = useState('Upper back: Architectural cadastre datum plan');
  const [price, setPrice] = useState<number>(3600);
  const [priceConfirmed, setPriceConfirmed] = useState(false);
  const [availability, setAvailability] = useState<ProductAvailability>('concept');
  const [gsm, setGsm] = useState<number>(280);
  const [composition, setComposition] = useState('100% Combed Organic Cotton');
  const [weave, setWeave] = useState('Heavy single jersey, preshrunk');
  const [fitNote, setFitNote] = useState('Boxy, wide chest profile with natural drape and dropped shoulders.');
  const [description, setDescription] = useState(
    'Engineered heavyweight jersey combining architectural technical typography with zero-inventory localized on-demand manufacturing.'
  );
  const [detailsText, setDetailsText] = useState(
    '280 GSM heavy combed cotton single jersey\nTwin-needle reinforced crew neck\nHigh-density vector print\nProduced to order via Qikink'
  );

  // Colorways
  const [colorways, setColorways] = useState<GarmentColorway[]>([
    PRESET_COLORS[0],
    PRESET_COLORS[1],
  ]);
  const [selectedColorwayId, setSelectedColorwayId] = useState(PRESET_COLORS[0].id);

  // Selected Sizes
  const [selectedSizes, setSelectedSizes] = useState<ApparelSize[]>(['XS', 'S', 'M', 'L', 'XL']);

  // Preview View
  const [activeView, setActiveView] = useState<GarmentView>('front');

  // Submission / Export states
  const [submitting, setSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derive active colorway for preview
  const activeColorway = colorways.find((c) => c.id === selectedColorwayId) || colorways[0] || PRESET_COLORS[0];

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/["']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleToggleColorway = (cw: GarmentColorway) => {
    const exists = colorways.some((c) => c.id === cw.id);
    if (exists) {
      if (colorways.length <= 1) return; // Keep at least one
      const updated = colorways.filter((c) => c.id !== cw.id);
      setColorways(updated);
      if (selectedColorwayId === cw.id) setSelectedColorwayId(updated[0].id);
    } else {
      setColorways([...colorways, cw]);
    }
  };

  const handleToggleSize = (size: ApparelSize) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length <= 1) return;
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const buildProductObject = (): ApparelProduct => {
    return {
      slug: slug.trim() || 'unnamed-product',
      code: code.trim() || 'ZB-XX',
      name: name.trim() || 'Untitled Garment',
      silhouette,
      colorways,
      print: {
        type: printType,
        frontPlacement,
        backPlacement,
      },
      sizes: selectedSizes,
      disabledSizes: [],
      fitNote,
      availability,
      price: Number(price) || 0,
      currency: 'INR',
      priceConfirmed,
      fabric: {
        gsm: Number(gsm) || 240,
        composition,
        weave,
        unconfirmed: !priceConfirmed,
      },
      care: [
        'Cold machine wash with like colors (30°C)',
        'Line dry in shade to preserve print alignment',
        'Iron inside out on low heat — avoid direct print contact',
        'Do not tumble dry or bleach',
      ],
      sizeChart: [
        { size: 'XS', chestCm: 56, lengthCm: 71, shoulderCm: 52, sleeveCm: 22 },
        { size: 'S', chestCm: 59, lengthCm: 73, shoulderCm: 54, sleeveCm: 23 },
        { size: 'M', chestCm: 62, lengthCm: 75, shoulderCm: 56, sleeveCm: 24 },
        { size: 'L', chestCm: 65, lengthCm: 77, shoulderCm: 58, sleeveCm: 25 },
        { size: 'XL', chestCm: 68, lengthCm: 79, shoulderCm: 60, sleeveCm: 26 },
        { size: 'XXL', chestCm: 71, lengthCm: 81, shoulderCm: 62, sleeveCm: 27 },
      ],
      sortOrder: 10,
      featured: true,
      description,
      details: detailsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      productionNote:
        'Produced strictly to order via Qikink. Zero speculative warehouse inventory. Lead times reflect custom printing and individual quality check before dispatch.',
    };
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const product = buildProductObject();
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push('/admin/apparel');
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Failed to save product specification.');
      }
    } catch {
      setErrorMsg('Network error communicating with administrative API.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    const product = buildProductObject();
    const snippet = `  ${JSON.stringify(product, null, 2)},`;
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <Link
            href="/admin/apparel"
            className="inline-flex items-center gap-1.5 text-xs font-mono-tag text-[var(--stone)] hover:text-[var(--text-primary)] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO APPAREL CATALOG</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)]">
            Garment Creator & Vector CAD Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 border border-[var(--border-color)] text-xs font-mono-tag uppercase tracking-wider hover:border-[var(--text-primary)] transition-colors flex items-center gap-2 cursor-pointer"
            title="Copy TypeScript snippet for src/data/apparel.ts"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'TS SNIPPET COPIED' : 'COPY TS CODE'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={submitting}
            className="px-5 py-2 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-mono-tag uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span>SAVING...</span>
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>SAVED TO CATALOG</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>PUBLISH TO STORE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Product Specs (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Identification */}
          <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-card)] space-y-4">
            <span className="font-mono-tag text-[10px] text-[var(--stone)] uppercase tracking-wider block">
              [SPEC 01 // IDENTIFICATION]
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Product Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                  placeholder="ZB-05"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Garment Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                  placeholder="Heavyweight Boxy Tee 'Datum'"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                URL Slug (/brands/zenith-district/shop/...)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                placeholder="heavyweight-boxy-tee-datum"
              />
            </div>
          </div>

          {/* Section 2: Silhouette & Vector Print */}
          <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-card)] space-y-5">
            <span className="font-mono-tag text-[10px] text-[var(--stone)] uppercase tracking-wider block">
              [SPEC 02 // SILHOUETTE & PRINT CAD]
            </span>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-2">
                Garment Silhouette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SILHOUETTES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSilhouette(s.id)}
                    className={`p-3 text-left border text-xs font-mono transition-colors cursor-pointer ${
                      silhouette === s.id
                        ? 'border-[var(--signal)] bg-[var(--signal)]/5 text-[var(--signal)] font-medium'
                        : 'border-[var(--border-color)] text-[var(--muted-text)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-2">
                Vector Motif Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRINT_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setPrintType(pt.id)}
                    className={`p-3 text-left border text-xs font-mono transition-colors cursor-pointer ${
                      printType === pt.id
                        ? 'border-[var(--signal)] bg-[var(--signal)]/5 text-[var(--signal)] font-medium'
                        : 'border-[var(--border-color)] text-[var(--muted-text)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="font-bold">{pt.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{pt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Front Placement Specification
                </label>
                <input
                  type="text"
                  value={frontPlacement}
                  onChange={(e) => setFrontPlacement(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Back Placement Specification
                </label>
                <input
                  type="text"
                  value={backPlacement}
                  onChange={(e) => setBackPlacement(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Colorways & Sizing */}
          <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-card)] space-y-5">
            <span className="font-mono-tag text-[10px] text-[var(--stone)] uppercase tracking-wider block">
              [SPEC 03 // COLORWAYS & SIZES]
            </span>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-2">
                Active Fabric Colorways (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_COLORS.map((cw) => {
                  const isSelected = colorways.some((c) => c.id === cw.id);
                  return (
                    <button
                      key={cw.id}
                      type="button"
                      onClick={() => handleToggleColorway(cw)}
                      className={`flex items-center gap-2 px-3 py-2 border text-xs font-mono transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[var(--signal)] bg-[var(--signal)]/5 text-[var(--text-primary)] font-semibold'
                          : 'border-[var(--border-color)] text-[var(--stone)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="w-4 h-4 border border-[var(--border-color)] shrink-0"
                        style={{ backgroundColor: cw.hex }}
                      />
                      <span>{cw.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-[var(--signal)]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleToggleSize(sz)}
                      className={`w-12 h-10 border text-xs font-mono transition-colors cursor-pointer flex items-center justify-center ${
                        isChecked
                          ? 'border-[var(--signal)] bg-[var(--signal)] text-white font-bold'
                          : 'border-[var(--border-color)] text-[var(--stone)] hover:border-[var(--text-primary)]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Pricing & Textile Specs */}
          <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-card)] space-y-4">
            <span className="font-mono-tag text-[10px] text-[var(--stone)] uppercase tracking-wider block">
              [SPEC 04 // COMMERCIAL & TEXTILE DETAILS]
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Retail Price (INR ₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Fabric Weight (GSM)
                </label>
                <input
                  type="number"
                  value={gsm}
                  onChange={(e) => setGsm(Number(e.target.value))}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Availability State
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as ProductAvailability)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                >
                  <option value="concept">concept</option>
                  <option value="sampling">sampling</option>
                  <option value="preorder">preorder</option>
                  <option value="available">available</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Fabric Composition
                </label>
                <input
                  type="text"
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                  Weave / Texture
                </label>
                <input
                  type="text"
                  value={weave}
                  onChange={(e) => setWeave(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="price-confirmed"
                checked={priceConfirmed}
                onChange={(e) => setPriceConfirmed(e.target.checked)}
                className="rounded-none accent-[var(--signal)]"
              />
              <label htmlFor="price-confirmed" className="text-xs font-mono text-[var(--muted-text)] cursor-pointer">
                Price & Textile Confirmed with Qikink Supplier (removes "Concept" disclaimers on PDP)
              </label>
            </div>
          </div>

          {/* Section 5: Editorial Notes */}
          <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-card)] space-y-4">
            <span className="font-mono-tag text-[10px] text-[var(--stone)] uppercase tracking-wider block">
              [SPEC 05 // EDITORIAL COPY & SPECIFICATION BULLETS]
            </span>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                Tailor's Fit Note
              </label>
              <input
                type="text"
                value={fitNote}
                onChange={(e) => setFitNote(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                Product Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-tag uppercase text-[var(--stone)] mb-1.5">
                Bullet Features (one per line)
              </label>
              <textarea
                rows={4}
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--signal)]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive CAD Garment Preview (5 Columns - Sticky) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="border border-[var(--border-color)] bg-[var(--surface-card)] p-5 space-y-4">
            {/* Preview Header & View Switcher */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-[var(--signal)]" />
                <span className="text-[11px] font-mono-tag uppercase tracking-wider font-semibold text-[var(--text-primary)]">
                  LIVE VECTOR CAD RENDER
                </span>
              </div>

              {/* Front/Back/Detail Toggle */}
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveView('front')}
                  className={`px-2 py-1 border transition-colors cursor-pointer ${
                    activeView === 'front'
                      ? 'border-[var(--signal)] bg-[var(--signal)] text-white'
                      : 'border-[var(--border-color)] text-[var(--stone)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  FRONT
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('back')}
                  className={`px-2 py-1 border transition-colors cursor-pointer ${
                    activeView === 'back'
                      ? 'border-[var(--signal)] bg-[var(--signal)] text-white'
                      : 'border-[var(--border-color)] text-[var(--stone)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('detail-print')}
                  className={`px-2 py-1 border transition-colors cursor-pointer ${
                    activeView === 'detail-print'
                      ? 'border-[var(--signal)] bg-[var(--signal)] text-white'
                      : 'border-[var(--border-color)] text-[var(--stone)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  CROP
                </button>
              </div>
            </div>

            {/* Active Colorway Selector on Preview */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-[var(--stone)] uppercase font-mono-tag">Preview Fabric:</span>
              <div className="flex items-center gap-2">
                {colorways.map((cw) => (
                  <button
                    key={cw.id}
                    type="button"
                    onClick={() => setSelectedColorwayId(cw.id)}
                    className={`w-5 h-5 border transition-all cursor-pointer ${
                      selectedColorwayId === cw.id
                        ? 'border-[var(--signal)] scale-110 ring-1 ring-[var(--signal)]'
                        : 'border-[var(--border-color)] opacity-70'
                    }`}
                    style={{ backgroundColor: cw.hex }}
                    title={cw.label}
                  />
                ))}
                <span className="text-[11px] text-[var(--text-primary)] font-semibold ml-1">
                  {activeColorway.label}
                </span>
              </div>
            </div>

            {/* The Actual Real <GarmentMock /> SVG Renderer */}
            <div className="border border-[var(--border-color)] bg-[var(--bg-page)] relative aspect-4/5 w-full flex items-center justify-center overflow-hidden">
              <GarmentMock
                silhouette={silhouette}
                colorway={activeColorway}
                view={activeView}
                print={{
                  type: printType,
                  frontPlacement,
                  backPlacement,
                }}
                className="w-full h-full"
              />
            </div>

            {/* CAD Telemetry Diagnostics */}
            <div className="p-3 bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[10px] font-mono space-y-1.5">
              <div className="flex justify-between text-[var(--stone)]">
                <span>CAD SILHOUETTE:</span>
                <span className="text-[var(--text-primary)] uppercase">{silhouette}</span>
              </div>
              <div className="flex justify-between text-[var(--stone)]">
                <span>MOTIF SHADER:</span>
                <span className="text-[var(--text-primary)] uppercase">{printType}</span>
              </div>
              <div className="flex justify-between text-[var(--stone)]">
                <span>ACTIVE HEX:</span>
                <span className="text-[var(--text-primary)] font-bold">{activeColorway.hex}</span>
              </div>
              <div className="flex justify-between text-[var(--stone)]">
                <span>DISPLAY PRICE:</span>
                <span className="text-[var(--signal)] font-bold">₹{price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
