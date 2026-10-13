import React from 'react';
import { Metadata } from 'next';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Operations & Venture Admin // ZenithDistrict',
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <AdminLoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <AdminNav />
      <main className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
