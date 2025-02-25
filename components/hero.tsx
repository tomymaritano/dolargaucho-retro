import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Hero: React.FC = () => {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <section className="relative w-full text-center pt-32 pb-20 text-white flex flex-col items-center overflow-hidden bg-gradient-to-b from-black to-gray-900">
      {/* Partículas Web3 */}
      <Particles
        className="absolute inset-0"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            shape: { type: "circle" },
            color: { value: ["#00b4d8", "#90e0ef", "#ffffff"] },
            opacity: { value: 0.2, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1, random: true, outModes: "out" },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "bubble" },
              onClick: { enable: true, mode: "repulse" },
            },
            modes: {
              bubble: { distance: 120, size: 6, duration: 2, opacity: 0.4 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
        }}
      />

      {/* Contenido Principal */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto px-6 mb-8 relative z-10 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-wide text-cyan-400 font-web3">
          💹 Cotización en Tiempo Real
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Consulta el <span className="font-bold text-white">Dólar Blue</span>, MEP y Cripto en tiempo real. 🚀
          <br /> Accede a gráficos, tendencias y más.
        </p>

        <motion.a
          href="#cotizaciones"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-6 py-3 text-lg font-bold text-white uppercase bg-cyan-500 rounded-lg shadow-lg transition-all hover:shadow-cyan-400/50"
        >
          Ver Cotización <FaArrowRight />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
