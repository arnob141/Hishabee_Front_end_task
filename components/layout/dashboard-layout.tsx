'use client';

import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { useAuthStore } from '@/store/auth-store';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
            {description && <p className="text-gray-600 mt-2">{description}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}