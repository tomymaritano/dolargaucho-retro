import React, { Suspense, lazy } from 'react';
import Hero from '@/components/hero';
import { NavbarPro } from '@/components/ui/NavbarPro';
import Footer from '@/components/footer';
import DolarTable from '@/components/dolartable';
import { FaSpinner } from 'react-icons/fa';

// Lazy load components
const ContactForm = lazy(() => import('@/components/contactform'));
const Faqs = lazy(() => import('@/components/faqs'));
const InflationCalculator = lazy(() => import('@/components/calculadoras/CalculadoraInflacion'));
const InflacionChart = lazy(() => import('@/components/charts/inflationchart'));
const CotizacionesInternacionales = lazy(() => import('@/components/CotizacionesInternacionales'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="flex flex-col items-center gap-3">
      <FaSpinner className="animate-spin text-accent-emerald text-3xl" />
      <p className="text-secondary text-sm">Cargando datos...</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-dark via-dark-light to-dark text-white min-h-screen font-sans">
      <NavbarPro variant="transparent" />
      <Hero />

      {/* Financial data section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
            <span className="gradient-text">Mercado Cambiario</span>
          </h2>
          <p className="text-secondary text-sm">
            Cotizaciones actualizadas automáticamente cada 30 segundos
          </p>
        </div>

        <DolarTable />
      </section>

      {/* International currencies section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Suspense fallback={<LoadingSpinner />}>
          <CotizacionesInternacionales />
        </Suspense>
      </section>

      {/* Inflation section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Suspense fallback={<LoadingSpinner />}>
          <InflacionChart />
          <InflationCalculator />
        </Suspense>
      </section>

      {/* FAQs section */}
      <section className="mx-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <Faqs />
        </Suspense>
      </section>

      {/* Contact section */}
      <section className="mx-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <ContactForm />
        </Suspense>
      </section>

      <Footer />
    </div>
  );
}
