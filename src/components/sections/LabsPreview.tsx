import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { LabExperiment } from '@/data/types';
import { ArrowRight } from 'lucide-react';

interface LabsPreviewProps {
  experiments?: LabExperiment[];
}

export function LabsPreview({}: LabsPreviewProps) {
  return (
    <section
      id="labs-section"
      className="py-20 md:py-32 hairline-border-b scroll-mt-20"
      aria-label="Labs Division Overview"
    >
      <Container>
        <SectionHeader
          index="06"
          title="LABS & EXPERIMENTS"
          code="Z-04"
          caption="Our experimental division where ideas are explored before they earn the right to become products or companies."
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono-tag text-[10px] tracking-wider uppercase border border-[var(--border-color)] bg-[var(--surface-elevated)] text-[var(--text-primary)] select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse" aria-hidden="true" />
              <span>UNDER DEVELOPMENT</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)]">
              Labs, Coming Soon.
            </h3>

            <p className="text-sm md:text-base text-[var(--muted-text)] leading-relaxed">
              A space for experiments, ideas, and digital products. New things are in the works.
            </p>
          </div>

          <Link
            href="/labs"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-color)] hover:border-[var(--signal)] hover:text-[var(--signal)] font-mono-tag text-xs tracking-wider uppercase transition-colors shrink-0"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="pt-8 flex items-center justify-between font-mono-tag text-xs text-[var(--muted-text)] hairline-border-t">
          <span>ACTIVE HYPOTHESES & TECHNICAL PROTOTYPING</span>
          <span>DISTRICT SECTOR SE</span>
        </div>
      </Container>
    </section>
  );
}
