'use client';

import React, { useState } from 'react';
import { Cpu, CheckCircle2, XCircle, RefreshCw, Send, ShieldAlert, Terminal } from 'lucide-react';

export function QikinkConsoleClient() {
  const [authLoading, setAuthLoading] = useState(false);
  const [authResult, setAuthResult] = useState<Record<string, unknown> | null>(null);

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<Record<string, unknown> | null>(null);

  const handleTestAuth = async () => {
    setAuthLoading(true);
    setAuthResult(null);
    try {
      const res = await fetch('/api/qikink/auth');
      const data = await res.json();
      setAuthResult(data);
    } catch (err: unknown) {
      setAuthResult({ error: err instanceof Error ? err.message : 'Network failure' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTestOrder = async () => {
    setOrderLoading(true);
    setOrderResult(null);
    try {
      const testPayload = {
        customer: {
          first_name: 'Prince',
          last_name: 'Singh',
          address1: 'Sector 4, Building 12',
          city: 'Bengaluru',
          state_id: 'KA',
          country_id: 'IN',
          zip: '560001',
          phone: '9876543210',
          email: 'admin@zenithdistrict.com',
        },
        is_sandbox_test: true,
      };

      const res = await fetch('/api/qikink/order/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      const data = await res.json();
      setOrderResult(data);
    } catch (err: unknown) {
      setOrderResult({ error: err instanceof Error ? err.message : 'Network failure' });
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-elevated)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--signal)]" />
            <h2 className="text-xs font-mono-tag uppercase tracking-wider text-[var(--text-primary)]">
              QIKINK PRINT-ON-DEMAND DISPATCH ENGINE
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[var(--stone)]">INTEGRATION // API-V2</span>
        </div>

        <p className="text-xs text-[var(--muted-text)] leading-relaxed">
          ZenithDistrict Apparel operates strictly on demand with zero speculative stock. Garments are queued to Qikink’s direct-to-garment & sublimation printers upon customer verification.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 border border-[var(--border-color)] bg-[var(--bg-page)]">
            <span className="text-[10px] text-[var(--stone)] block uppercase font-mono-tag">Base Endpoint</span>
            <span className="text-[var(--text-primary)] truncate block">https://sandbox.qikink.com</span>
          </div>
          <div className="p-3 border border-[var(--border-color)] bg-[var(--bg-page)]">
            <span className="text-[10px] text-[var(--stone)] block uppercase font-mono-tag">Auth Strategy</span>
            <span className="text-[var(--text-primary)] block">OAuth Bearer /api/token</span>
          </div>
          <div className="p-3 border border-[var(--border-color)] bg-[var(--bg-page)]">
            <span className="text-[10px] text-[var(--stone)] block uppercase font-mono-tag">Environment</span>
            <span className="text-amber-500 uppercase font-semibold block">Sandbox Mode</span>
          </div>
        </div>
      </div>

      {/* Action 1: Auth Token Verification */}
      <div className="border border-[var(--border-color)] bg-[var(--surface-card)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">1. Credentials & Token Handshake</h3>
            <p className="text-xs text-[var(--muted-text)] mt-0.5">
              Verifies whether `QIKINK_CLIENT_ID` and `QIKINK_CLIENT_SECRET` generate a valid access token.
            </p>
          </div>

          <button
            onClick={handleTestAuth}
            disabled={authLoading}
            className="px-4 py-2 border border-[var(--border-color)] hover:border-[var(--signal)] hover:text-[var(--signal)] text-xs font-mono-tag uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${authLoading ? 'animate-spin' : ''}`} />
            <span>{authLoading ? 'PROBING API...' : 'TEST AUTH HANDSHAKE'}</span>
          </button>
        </div>

        {authResult && (
          <div className="p-4 bg-[var(--bg-page)] border border-[var(--border-color)] text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono-tag uppercase">
              {authResult.authenticated ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">HANDSHAKE SUCCEEDED</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-500 font-bold">CREDENTIALS REQUIRED</span>
                </>
              )}
            </div>
            <pre className="text-[11px] text-[var(--muted-text)] overflow-x-auto p-2 bg-[var(--surface-elevated)] border border-[var(--border-color)]">
              {JSON.stringify(authResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Action 2: Sandbox Order Dispatch */}
      <div className="border border-[var(--border-color)] bg-[var(--surface-card)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">2. Sandbox Test Order Dispatch</h3>
            <p className="text-xs text-[var(--muted-text)] mt-0.5">
              Transmits a mock customer shipping order to the Qikink sandbox pipeline.
            </p>
          </div>

          <button
            onClick={handleTestOrder}
            disabled={orderLoading}
            className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-page)] hover:opacity-90 text-xs font-mono-tag uppercase tracking-wider transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${orderLoading ? 'animate-pulse' : ''}`} />
            <span>{orderLoading ? 'TRANSMITTING...' : 'DISPATCH TEST ORDER'}</span>
          </button>
        </div>

        {orderResult && (
          <div className="p-4 bg-[var(--bg-page)] border border-[var(--border-color)] text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono-tag uppercase">
              <Terminal className="w-4 h-4 text-[var(--signal)]" />
              <span className="font-bold text-[var(--text-primary)]">SERVER RESPONSE</span>
            </div>
            <pre className="text-[11px] text-[var(--muted-text)] overflow-x-auto p-2 bg-[var(--surface-elevated)] border border-[var(--border-color)]">
              {JSON.stringify(orderResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
