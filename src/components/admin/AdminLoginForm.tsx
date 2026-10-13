'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.refresh();
        router.push('/admin');
      } else {
        setError(data.error || 'Authentication denied. Verify passphrase.');
      }
    } catch {
      setError('Network communication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 border border-[var(--border-color)] bg-[var(--surface-elevated)]">
      {/* Header */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-[10px] font-mono-tag tracking-widest text-[var(--stone)] uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--signal)]" />
          <span>AUTHENTICATION PROTOCOL // SEC-01</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-serif text-[var(--text-primary)]">
          ZenithDistrict Operations
        </h1>
        <p className="text-xs text-[var(--muted-text)] leading-relaxed">
          Authorized personnel only. Enter administrative passphrase to access the venture catalog, Qikink POD controls, and telemetry.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="admin-password"
            className="block text-[10px] font-mono-tag tracking-widest uppercase text-[var(--stone)] mb-2"
          >
            Passphrase
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              disabled={loading}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--stone)] focus:outline-none focus:border-[var(--signal)] font-mono transition-colors"
              autoFocus
            />
            <Lock className="w-3.5 h-3.5 text-[var(--stone)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password.trim()}
          className="w-full py-2.5 px-4 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-mono-tag tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <span>VERIFYING...</span>
          ) : (
            <>
              <span>AUTHENTICATE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Development Notice */}
      <div className="mt-8 pt-4 border-t border-[var(--border-color)] text-[10px] font-mono-tag text-[var(--stone)] flex items-center justify-between">
        <span>DEFAULT DEV PASSPHRASE:</span>
        <span className="text-[var(--text-primary)] font-mono">zenithdistrict</span>
      </div>
    </div>
  );
}
