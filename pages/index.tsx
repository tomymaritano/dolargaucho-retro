import React from "react";
import Hero from "@/components/hero";
import useDolar from "../hooks/useDolar";
import DolarCard from "@/components/dolarcard";
import ContactForm from "@/components/contactform";
import Layout from "@/components/layout";
import DolarList from "@/components/dolarlist";

export default function Home() {
  const { dolar, loading, error } = useDolar();

  return (
    <Layout>
      <Hero />

      {/* Sección de Cotizaciones */}
      <div id="cotizacion" className="flex flex-col items-center justify-center p-8 w-full">
        {loading && (
          <p className="text-cyan-400 text-lg animate-pulse">Cargando cotizaciones...</p>
        )}

        {error && (
          <p className="text-red-400 text-lg font-semibold animate-bounce">Error: {error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
          {Array.isArray(dolar) && dolar.length > 0 ? (
            dolar.map((tipo) => (
              <div className="w-full md:w-auto" key={tipo.nombre}>
                <DolarCard data={tipo} />
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-400 text-lg">No hay datos disponibles.</p>
          )}
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#141e30] text-white p-10">
        <DolarList />
      </div>
      {/* Formulario de Contacto */}
      <ContactForm />
    </Layout>
  );
}