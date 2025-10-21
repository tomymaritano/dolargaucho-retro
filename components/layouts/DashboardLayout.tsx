'use client';

import React from 'react';
import { useRequireAuth } from '@/lib/contexts/AuthContext';
import { DashboardNavbar } from '@/components/DashboardNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Require authentication - will redirect to login if not authenticated
  const { user, loading } = useRequireAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-secondary">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard until user is authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      {/* Main Content - Full width, adjusted for navbar + marquee */}
      <main className="pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
