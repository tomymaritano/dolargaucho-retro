import React from "react";
import Hero from "@/components/hero";
import useDolar from "../hooks/useDolar";
import DolarCard from "@/components/dolarcard";
import ContactForm from "@/components/contactform";
import Layout from "@/components/layout";
import CalculatorsContainer from "@/components/calculators/calculatorscontainer";
import InflationChart from "@/components/inflationchart";
import CountryRisk from "@/components/risk";

export default function Home() {
  const { dolar, loading, error } = useDolar();

  return (
    <Layout>
      {/* Hero */}
      <Hero />

      {/* Cotizaciones del Dólar */}
      <section className="bg-black text-white py-20 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-extrabold text-[#007aff]">💵 Cotizaciones en Vivo</h2>
            <p className="text-2xl text-gray-300 mt-4 max-w-3xl mx-auto">
              Consulta las últimas cotizaciones del dólar en Argentina con datos en tiempo real.
            </p>
          </div>

          {loading && <p className="text-[#007aff] text-xl animate-pulse text-center">Cargando datos...</p>}
          {error && <p className="text-red-500 text-xl font-semibold text-center">Error: {error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.isArray(dolar) && dolar.length > 0 ? (
              dolar.map((tipo) => <DolarCard key={tipo.nombre} data={tipo} />)
            ) : (
              !loading && <p className="text-gray-500 text-xl text-center">No hay datos disponibles.</p>
            )}
          </div>
        </div>
      </section>



      {/* Calculadoras */}
      <section className="bg-black text-white py-24 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-extrabold text-[#f7931a]">📈 Herramientas Avanzadas</h2>
            <p className="text-2xl text-gray-300 mt-4 max-w-3xl mx-auto">
              Analiza inversiones, inflación y más con nuestras calculadoras financieras interactivas.
            </p>
          </div>
          <CalculatorsContainer />
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-[#121212] text-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-extrabold text-[#007aff]">📩 Contacto Directo</h2>
            <p className="text-2xl text-gray-300 mt-4 max-w-3xl mx-auto">
              ¿Tienes dudas o sugerencias? Envíanos tu mensaje y nuestro equipo te responderá rápido.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
}