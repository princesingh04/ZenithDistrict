import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default async function AdminLoginPage() {
  const isAuth = await isAdminAuthenticated();
  if (isAuth) {
    redirect('/admin');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <AdminLoginForm />
    </div>
  );
}
