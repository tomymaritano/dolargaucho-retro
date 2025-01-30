// pages/index.tsx
import React from 'react';
import Hero from '../components/hero';
import useDolar from '../hooks/useDolar';
import DolarCard from '../components/dolarcard';
import Navbar from '@/components/navbar';
import MarqueeSlider from '@/components/marqueslider';
import Footer from '@/components/footer';

export default function Home() {
  const { dolar, loading, error } = useDolar();

  return (
    <div className="bg-gradient-to-r from-purple-900 to-pink-700 text-yellow-300 min-h-screen font-mono">
      <Navbar />
      <Hero />
      <MarqueeSlider />
      <div id="cotizacion" className="flex flex-col items-center justify-center p-6 w-full">
        {loading && <p className="text-yellow-400">Cargando...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl px-4 flex-wrap">
          {dolar.map((tipo) => (
            <div className="w-full md:w-auto" key={tipo.nombre}>
              <DolarCard data={tipo} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}