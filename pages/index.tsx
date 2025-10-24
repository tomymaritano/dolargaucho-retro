import React, { Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import { NavbarFloating } from '@/components/NavbarFloating';
import Footer from '@/components/Footer';
import { FeaturesSimple } from '@/components/marketing/FeaturesSimple';
import { FounderStory } from '@/components/marketing/FounderStory';
import { DataSourcesSection } from '@/components/marketing/DataSourcesSection';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { FaSpinner } from 'react-icons/fa';
import { SEO } from '@/components/SEO';

// Lazy load FAQs only
const Faqs = lazy(() => import('@/components/Faqs'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="flex flex-col items-center gap-3">
      <FaSpinner className="animate-spin text-brand text-3xl" />
      <p className="text-secondary text-sm">Cargando...</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
      <SEO />
      <div className="text-foreground min-h-screen font-sans">
        {/* Floating Navbar */}
        <NavbarFloating />

        {/* Hero - Main message + CTA */}
        <Hero />

        {/* Features - Bento grid with capabilities */}
        <FeaturesSimple />

        {/* Founder Story - Mission & Team */}
        <FounderStory />

        {/* Data Sources - Credibility */}
        <DataSourcesSection />

        {/* Final CTA - Conversion */}
        <FinalCTA />

        {/* FAQs */}
        <section id="faqs">
          <Suspense fallback={<LoadingSpinner />}>
            <Faqs />
          </Suspense>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
