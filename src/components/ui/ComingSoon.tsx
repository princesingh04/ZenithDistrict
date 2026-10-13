import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface ComingSoonProps {
  divisionCode?: string;
  divisionTitle?: string;
  sector?: string;
  title: string;
  description: string;
  statusLabel?: string;
  homeHref?: string;
  liveProductsHref?: string;
}

export function ComingSoon({
  divisionCode,
  divisionTitle,
  sector = 'DISTRICT SECTOR',
  title,
  description,
  statusLabel = 'UNDER DEVELOPMENT',
  homeHref = '/',
  liveProductsHref = '/#live-products',
}: ComingSoonProps) {
  return (
    <main
      className="min-h-[75vh] flex flex-col justify-center py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="coming-soon-heading"
    >
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Top Architectural Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 hairline-border-b font-mono-tag text-xs text-[var(--stone)]">
            <div className="flex items-center gap-2.5">
              {divisionCode && (
                <span className="px-2 py-0.5 border border-[var(--border-color)] bg-[var(--surface-elevated)] text-[var(--text-primary)] font-medium">
                  {divisionCode}
                </span>
              )}
              {divisionTitle && (
                <span className="uppercase text-[var(--muted-text)]">
                  {divisionTitle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase text-[var(--stone)]">
                {sector}
              </span>
            </div>
          </div>

          {/* Central Coming Soon Hero */}
          <div className="space-y-6">
            {/* Subtle Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono-tag text-[10px] tracking-wider uppercase border border-[var(--border-color)] bg-[var(--surface-elevated)] text-[var(--text-primary)] select-none">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse"
                aria-hidden="true"
              />
              <span>{statusLabel}</span>
            </div>

            {/* Main Heading */}
            <h1
              id="coming-soon-heading"
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[var(--text-primary)] leading-[1.05]"
            >
              {title}
            </h1>

            {/* Explanatory Lead Paragraph */}
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted-text)] leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Action Links */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href={liveProductsHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--ink)] text-[var(--bone)] dark:bg-[var(--bone)] dark:text-[var(--ink)] hover:bg-[var(--signal)] hover:text-white dark:hover:bg-[var(--signal)] dark:hover:text-white font-mono-tag text-xs tracking-wider uppercase transition-colors rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
            >
              <span>Explore Live Products</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href={homeHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--signal)] hover:text-[var(--signal)] font-mono-tag text-xs tracking-wider uppercase transition-colors rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Architectural Cadastre Footer Note */}
          <div className="pt-10 hairline-border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-tag text-[10px] text-[var(--stone)]">
            <span>ZENITHDISTRICT VENTURE HOUSE // ACTIVE DEVELOPMENT PHASE</span>
            <span>NO PLACEHOLDERS // REAL WORK IN PROGRESS</span>
          </div>
        </div>
      </Container>
    </main>
  );
}
