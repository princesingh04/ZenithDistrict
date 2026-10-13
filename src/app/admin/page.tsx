import React from 'react';
import Link from 'next/link';
import { getApparelProducts } from '@/data/apparel';
import { getProducts, getLabs, getAllDivisions } from '@/lib/content';
import { siteConfig } from '@/data/site';
import {
  Shirt,
  Box,
  FlaskConical,
  Briefcase,
  PlusCircle,
  Cpu,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const [apparel, products, labs, divisions] = await Promise.all([
    getApparelProducts(),
    getProducts(),
    getLabs(),
    getAllDivisions(),
  ]);

  const cards = [
    {
      code: 'Z-01',
      title: 'Studio Practice',
      count: '3 Practice Areas',
      desc: 'Active digital product engineering and architectural design.',
      route: '/studio',
      adminLink: '/admin/ventures',
      icon: Briefcase,
      color: '#3882F6',
    },
    {
      code: 'Z-02',
      title: 'Apparel Label',
      count: `${apparel.length} Garments`,
      desc: 'On-demand heavyweight garment catalog with vector CAD renders.',
      route: '/brands/zenith-district/shop',
      adminLink: '/admin/apparel',
      icon: Shirt,
      color: '#0018a8',
    },
    {
      code: 'Z-03',
      title: 'Software Products',
      count: `${products.length} Products`,
      desc: 'Client-side utilities and developer platforms (PDF, forum, cards).',
      route: '/products',
      adminLink: '/admin/ventures',
      icon: Box,
      color: '#8B5CF6',
    },
    {
      code: 'Z-04',
      title: 'Labs R&D',
      count: `${labs.length} Hypotheses`,
      desc: 'Experimental browser-native AI, WebGPU, and coordinate generators.',
      route: '/labs',
      adminLink: '/admin/ventures',
      icon: FlaskConical,
      color: '#FF4F1F',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <span className="font-mono-tag text-[10px] text-[var(--stone)] tracking-widest uppercase">
            OPERATING CADASTRE // CO-FOUNDER CONSOLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] mt-1">
            Venture House Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/apparel/new"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-mono-tag tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>CREATE GARMENT</span>
          </Link>
          <Link
            href="/admin/qikink"
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] text-xs font-mono-tag tracking-wider uppercase hover:border-[var(--signal)] hover:text-[var(--signal)] transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>QIKINK POD</span>
          </Link>
        </div>
      </div>

      {/* Divisional Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.code}
              className="p-5 border border-[var(--border-color)] bg-[var(--surface-card)] flex flex-col justify-between space-y-4 hover:border-[var(--signal)] transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono-tag">
                  <span className="font-bold text-[var(--signal)]">[{c.code}]</span>
                  <Icon className="w-4 h-4 text-[var(--stone)] group-hover:text-[var(--signal)] transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{c.title}</h3>
                  <div className="text-xl font-mono text-[var(--text-primary)] mt-1">{c.count}</div>
                </div>
                <p className="text-xs text-[var(--muted-text)] leading-relaxed">{c.desc}</p>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono-tag">
                <Link
                  href={c.adminLink}
                  className="text-[var(--text-primary)] hover:text-[var(--signal)] flex items-center gap-1 transition-colors"
                >
                  <span>MANAGE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href={c.route}
                  target="_blank"
                  className="text-[var(--stone)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
                >
                  <span>VIEW</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status & Commerce Mode */}
      <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-elevated)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-mono-tag tracking-wider uppercase text-[var(--text-primary)]">
              ACTIVE SYSTEM STATUS & RUNTIME FLAGS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[var(--stone)]">SITE VERSION: 0.1.0</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-mono">
          <div className="p-3 border border-[var(--border-color)] bg-[var(--bg-page)] space-y-1">
            <span className="text-[10px] text-[var(--stone)] block uppercase font-mono-tag">Commerce Mode</span>
            <span className="font-semibold text-emerald-500 uppercase">{siteConfig.shop.mode}</span>
          </div>
          <div className="p-3 border border-[var(--border-color)] bg-[var(--bg-page)] space-y-1">
            <span className="text-[10px] text-[var(--stone)] block uppercase font-mono-tag">Grid Dev Key (G)</span>
            <span className="text-[var(--text-primary)]">{siteConfig.flags.showGridDevToggle ? 'ENABLED' : 'DISABLED'}</span>
          </div>
          <div className="p-3 border border-[var(--border-color)] bg-[var(--bg-page)] space-y-1">
            <span className="text-[10px] text-[var(--stone)] block uppercase font-mono-tag">Careers Route</span>
            <span className="text-[var(--stone)]">{siteConfig.flags.showCareers ? 'ACTIVE' : 'MUTED'}</span>
          </div>
          <div className="p-3 border border-[var(--border-color)] bg-[var(--bg-page)] space-y-1">
            <span className="text-[10px] text-[var(--stone)] block uppercase font-mono-tag">Press Route</span>
            <span className="text-[var(--stone)]">{siteConfig.flags.showPress ? 'ACTIVE' : 'MUTED'}</span>
          </div>
        </div>
      </div>

      {/* Apparel Collection Snapshot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono-tag tracking-wider uppercase text-[var(--text-primary)]">
            CURRENT APPAREL RUN (COLLECTION 01)
          </h2>
          <Link
            href="/admin/apparel"
            className="text-xs font-mono-tag text-[var(--signal)] hover:underline flex items-center gap-1"
          >
            <span>VIEW ALL ({apparel.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="border border-[var(--border-color)] overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--surface-elevated)] border-b border-[var(--border-color)] text-[10px] uppercase font-mono-tag text-[var(--stone)]">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Silhouette</th>
                <th className="p-3">Print Type</th>
                <th className="p-3">Price</th>
                <th className="p-3">Fabric GSM</th>
                <th className="p-3">Availability</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {apparel.map((p) => (
                <tr key={p.slug} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                  <td className="p-3 font-bold text-[var(--signal)]">{p.code}</td>
                  <td className="p-3 font-sans font-medium text-[var(--text-primary)]">{p.name}</td>
                  <td className="p-3 text-[var(--stone)]">{p.silhouette}</td>
                  <td className="p-3 text-[var(--stone)]">{p.print.type}</td>
                  <td className="p-3 text-[var(--text-primary)]">₹{p.price.toLocaleString()}</td>
                  <td className="p-3 text-[var(--stone)]">{p.fabric.gsm || 'Unconfirmed'} GSM</td>
                  <td className="p-3">
                    <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-[var(--surface-elevated)] border border-[var(--border-color)]">
                      {p.availability}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/brands/zenith-district/shop/${p.slug}`}
                      target="_blank"
                      className="text-[var(--stone)] hover:text-[var(--signal)] inline-flex items-center gap-1"
                    >
                      <span>VIEW</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
