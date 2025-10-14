import React, { Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import { NavbarPro } from '@/components/ui/NavbarPro/NavbarPro';
import Footer from '@/components/Footer';
import DolarTable from '@/components/DolarTable';
import { FaSpinner } from 'react-icons/fa';

// Lazy load components
const Faqs = lazy(() => import('@/components/Faqs'));
const InflationCalculator = lazy(() => import('@/components/calculadoras/CalculadoraInflacion'));
const InflacionChart = lazy(() =>
  import('@/components/charts/InflacionChart').then((m) => ({ default: m.InflacionChart }))
);
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
    <div className="bg-background text-foreground min-h-screen font-sans">
      <NavbarPro />
      <Hero />

      {/* Mercado Cambiario */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
            <span className="gradient-text">Mercado Cambiario</span>
          </h2>
          <p className="text-secondary text-sm">
            Cotizaciones actualizadas automáticamente cada 30 segundos
          </p>
        </div>

        <DolarTable />
      </section>

      {/* Cotizaciones Internacionales */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <CotizacionesInternacionales />
        </Suspense>
      </section>

      {/* Evolución de la Inflación */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <InflacionChart />
        </Suspense>
      </section>

      {/* Calculadora de Inflación */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <InflationCalculator />
        </Suspense>
      </section>

      {/* FAQs */}
      <section>
        <Suspense fallback={<LoadingSpinner />}>
          <Faqs />
        </Suspense>
      </section>

      <Footer />
    </div>
  );
}
