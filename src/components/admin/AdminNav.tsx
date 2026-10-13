'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ArrowUpRight, LogOut, Shirt, LayoutDashboard, PlusCircle, Compass, Cpu } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', code: '01', icon: LayoutDashboard },
  { label: 'Apparel Catalog', href: '/admin/apparel', code: '02', icon: Shirt },
  { label: 'New Garment Studio', href: '/admin/apparel/new', code: '03', icon: PlusCircle },
  { label: 'Ventures Registry', href: '/admin/ventures', code: '04', icon: Compass },
  { label: 'Qikink POD Console', href: '/admin/qikink', code: '05', icon: Cpu },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.refresh();
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-page)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
      {/* Top Banner */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between border-b border-[var(--border-color)] text-xs font-mono-tag">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-bold tracking-[0.1em] text-[var(--text-primary)] hover:text-[var(--signal)] transition-colors">
            ZENITHDISTRICT
          </Link>
          <span className="text-[var(--stone)]">//</span>
          <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-widest bg-[var(--signal)]/10 text-[var(--signal)] border border-[var(--signal)]/30">
            INTERNAL OPS & ADMIN
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--muted-text)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span>LIVE STOREFRONT</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <span className="text-[var(--border-color)]">|</span>
          <ThemeToggle />
          <span className="text-[var(--border-color)]">|</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[var(--stone)] hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
            title="Terminate session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-2 sm:gap-6 py-2.5 text-[11px] font-mono-tag tracking-wider whitespace-nowrap">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 transition-colors border ${
                  isActive
                    ? 'border-[var(--signal)] text-[var(--signal)] bg-[var(--signal)]/5 font-medium'
                    : 'border-transparent text-[var(--muted-text)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>[{item.code} // {item.label.toUpperCase()}]</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
