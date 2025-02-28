import React from "react";
import Hero from "@/components/hero";
import useDolar from "@/hooks/useDolar";
import DolarCard from "@/components/dolarcard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ContactForm from "@/components/contactform";
import Faqs from "@/components/faqs";
import InflationCalculator from "@/components/calculadoras/calculadorainflacion";


export default function Home() {
  const { dolar, loading, error } = useDolar();

  return (
    <div className="bg-gradient-to-b from-[#121826] to-[#1c1f2e] text-white min-h-screen font-sans">
      <Navbar />
      <Hero />

      {/* 📌 Sección de Cotizaciones */}
      <section id="cotizacion" className="flex flex-col items-center justify-center py-12 px-6">
        {loading && <p className="text-blue-300 text-lg animate-pulse">Cargando cotizaciones...</p>}
        {error && <p className="text-red-400 text-lg font-semibold">Error: {error}</p>}

        {/* 🟢 Tarjetas de cotización en grid adaptable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {dolar.map((tipo) => (
            <DolarCard key={tipo.nombre} data={tipo} />
          ))}
        </div>
      </section>
      
      <InflationCalculator />
      <Faqs />
      <ContactForm />


      <Footer />
    </div>
  );
}