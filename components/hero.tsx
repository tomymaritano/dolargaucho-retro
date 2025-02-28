import React, { useState, useEffect, useRef } from "react";
import { FaUserPlus } from "react-icons/fa";
import UnicoComponente from "./test";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden pt-20 pb-28">
      
      {/* 🌊 Background */}
      <div className="absolute inset-0 bg-[url('/abstract-bg.svg')] bg-cover opacity-10"></div>

      {/* 🔥 Blurred Glow Effect */}
      <div className="absolute bottom-[-350px] left-[50%] transform -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-b from-[#5B21B6] to-transparent rounded-full blur-3xl opacity-40"></div>

      {/* 📌 Main Content */}
      <div className="relative z-10 text-center max-w-3xl px-6 mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-wide text-white">
          Cotización del Dólar en Argentina 💰
        </h1>
        <p className="text-lg text-gray-300 mt-3">
          Con <span className="font-bold text-white">Dólar Gaucho</span>, consulta las cotizaciones del dólar en Argentina: Oficial, Blue, MEP y más. 🚀
        </p>
      </div>

      {/* 📌 UnicoComponente (Country Risk & Dollar Exchange) */}
      <div className="relative z-20 w-full flex justify-center">
        <UnicoComponente />
      </div>

      {/* 📌 Call to Action Button */}
      <a
        href="#contacto"
        className="relative z-20 mt-12 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <FaUserPlus /> Sumate al Proyecto
      </a>
    </section>
  );
};

export default Hero;