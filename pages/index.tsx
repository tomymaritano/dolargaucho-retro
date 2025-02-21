import React from 'react';
import Hero from '@/components/hero';
import useDolar from '../hooks/useDolar';
import DolarCard from '@/components/dolarcard';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function Home() {
  const { dolar, loading, error } = useDolar();

  return (
    <div className="bg-gradient-to-b from-blue-950 to-blue-800 text-white min-h-screen font-sans">
      <Navbar />
      <Hero />
      
      <div id="cotizacion" className="flex flex-col items-center justify-center p-8 w-full">
        {loading && <p className="text-blue-300 text-lg">Cargando cotizaciones...</p>}
        {error && <p className="text-red-400 text-lg font-semibold">Error: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl  flex-wrap">
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