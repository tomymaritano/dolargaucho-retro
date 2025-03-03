import React from "react";
import Hero from "@/components/hero";
import useDolar from "@/hooks/useDolar";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ContactForm from "@/components/contactform";
import Faqs from "@/components/faqs";
import InflationCalculator from "@/components/calculadoras/calculadorainflacion";
import DolarTable from "@/components/dolartable";
import InflacionChart from "@/components/charts/inflationchart";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
  const { dolar, loading, error } = useDolar();

  return (
    <div className="bg-gradient-to-b from-[#121826] to-[#1c1f2e] text-white min-h-screen font-sans">
      {/* 📌 Navbar */}
      <Navbar />

      {/* 🎯 Hero Section */}
      <Hero />

      {/* 🔵 Sección de Datos Financieros */}
      <section className="max-w-6xl mx-auto px-6 py-12">

        {/* 🔵 Loading State para Tabla */}
        {loading ? (
          <div className="flex justify-center items-center text-blue-300 text-lg animate-pulse">
            <FaSpinner className="animate-spin mr-2" /> Cargando cotizaciones...
          </div>
        ) : error ? (
          <p className="text-red-400 text-lg font-semibold text-center">Error: {error}</p>
        ) : (
          <DolarTable data={dolar} />
        )}
      </section>

      {/* 🔥 Sección de Inflación */}
      <section className="max-w-6xl mx-auto">
        <InflacionChart />
        <InflationCalculator />
      </section>


      {/* ❓ FAQs */}
      <section className="mx-auto ">
        <Faqs />
      </section>

      {/* 📩 Formulario de Contacto */}
      <section className="mx-auto">
        <ContactForm />
      </section>

      {/* 📌 Footer */}
      <Footer />
    </div>
  );
}