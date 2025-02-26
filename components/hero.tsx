import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import CountryRisk from "./risk";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Hero: React.FC = () => {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <section className="relative w-full text-center pt-32 pb-24 text-white flex flex-col items-center bg-gradient-to-b from-black via-gray-900 to-black border-b border-gray-800 overflow-hidden">
      {/* Partículas Flotantes */}
      <Particles
        className="absolute inset-0 pointer-events-none"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 90, density: { enable: true, area: 900 } },
            shape: { type: "circle" },
            color: { value: ["#00b4d8", "#90e0ef", "#ffffff"] },
            opacity: { value: 0.15, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1, random: true, outModes: "out" },
          },
        }}
      />

      {/* Contenedor Principal */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-8 text-center relative z-10"
      >
        <h1 className="text-6xl font-extrabold tracking-tight text-white uppercase leading-tight font-[Inter] animate-glitch">
          Información Financiera en Tiempo Real
        </h1>
        <p className="text-xl text-gray-400 mt-4 max-w-3xl mx-auto font-[Inter]">
          Datos en vivo sobre <span className="text-[#007aff] font-semibold">dólar, criptomonedas e índices</span>.  
          Accede a información actualizada con <span className="text-[#007aff] font-semibold">análisis detallado</span>.
        </p>

        {/* CTA con efecto hover */}
        <motion.a
          href="#cotizacion"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
          className="mt-6 inline-flex items-center px-6 py-3 bg-[#007aff] text-white font-semibold text-lg rounded-lg shadow-lg 
          hover:bg-[#005bb5] transition-all font-[Inter] hover:shadow-cyan-400/40"
        >
          Ver Cotizaciones <FaArrowRight className="ml-2" />
        </motion.a>
      </motion.div>

      {/* Separador Visual */}
      <div className="mt-10 w-full max-w-6xl border-t border-gray-800"></div>

      {/* Riesgo País */}
      <div className="mt-6 w-full max-w-5xl">
        <CountryRisk />
      </div>
    </section>
  );
};

export default Hero;