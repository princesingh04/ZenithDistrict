import React from 'react';
import { QikinkConsoleClient } from '@/components/admin/QikinkConsoleClient';

export default function AdminQikinkPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6">
        <span className="font-mono-tag text-[10px] text-[var(--stone)] tracking-widest uppercase">
          Z-02 SUPPLY CHAIN // PRINT-ON-DEMAND TELEMETRY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] mt-1">
          Qikink Fulfillment Console
        </h1>
        <p className="text-xs text-[var(--muted-text)] mt-2 max-w-2xl leading-relaxed">
          Diagnostic tools to verify upstream OAuth tokens, test sandbox order webhooks, and validate direct-to-garment manufacturing payloads.
        </p>
      </div>

      <QikinkConsoleClient />
    </div>
  );
}
