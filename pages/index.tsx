import React, { Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import { NavbarFloating } from '@/components/NavbarFloating';
import Footer from '@/components/Footer';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { ProductShowcase } from '@/components/marketing/ProductShowcase';
import { DataSourcesSection } from '@/components/marketing/DataSourcesSection';
import { FinalCTA } from '@/components/marketing/FinalCTA';
import { FaSpinner } from 'react-icons/fa';

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
    <div className="text-foreground min-h-screen font-sans">
      {/* Floating Navbar */}
      <NavbarFloating />

      {/* Hero - Product-led with dashboard preview */}
      <Hero />

      {/* How It Works - Step by step with visuals */}
      <HowItWorksSection />

      {/* Product Showcase - Features with side-by-side layout */}
      <ProductShowcase />

      {/* Data Sources - Official APIs */}
      <DataSourcesSection />

      {/* Final CTA - Conversion section */}
      <FinalCTA />

      {/* FAQs */}
      <section id="faqs">
        <Suspense fallback={<LoadingSpinner />}>
          <Faqs />
        </Suspense>
      </section>

      {/* Footer with tech stack */}
      <Footer />
    </div>
  );
}
