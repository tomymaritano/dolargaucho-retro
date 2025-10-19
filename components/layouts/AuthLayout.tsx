/**
 * AuthLayout
 *
 * Unified layout for all authentication pages (login, signup, forgot-password, reset-password)
 * Provides consistent branding, styling, and navigation structure
 * Uses same navbar as marketing site for consistency
 */

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { NavbarFloating } from '@/components/NavbarFloating';
import Aurora from '@/components/ui/Aurora/Aurora';

interface AuthLayoutProps {
  /** Page title for <Head> */
  title: string;
  /** Main heading text */
  heading: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Child components (form, content) */
  children: React.ReactNode;
  /** Optional footer action (e.g., "Don't have an account? Sign up") */
  footerAction?: React.ReactNode;
  /** Show back to home link (default: true) */
  showBackToHome?: boolean;
  /** Maximum width of content container (default: 'md' = 28rem) */
  maxWidth?: 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-sm', // 24rem (384px)
  md: 'max-w-md', // 28rem (448px)
  lg: 'max-w-lg', // 32rem (512px)
};

export function AuthLayout({
  title,
  heading,
  subtitle,
  children,
  footerAction,
  showBackToHome = true,
  maxWidth = 'md',
}: AuthLayoutProps) {
  return (
    <>
      <Head>
        <title>{title} | Dólar Gaucho</title>
        <meta name="description" content={subtitle || title} />
      </Head>

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Same navbar as marketing site */}
        <NavbarFloating />

        {/* Aurora background (same as Hero) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <Aurora
            colorStops={['#0047FF', '#8B5CF6', '#6366F1']}
            amplitude={1.2}
            blend={0.6}
            speed={0.8}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-32">
          <div className={`w-full ${maxWidthClasses[maxWidth]}`}>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">{heading}</h2>
              {subtitle && <p className="text-secondary text-base max-w-md mx-auto">{subtitle}</p>}
            </div>

            {/* Main Content (form, cards, etc.) */}
            <div>{children}</div>

            {/* Footer Action (e.g., "Don't have account? Sign up") */}
            {footerAction && <div className="mt-6 text-center">{footerAction}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
