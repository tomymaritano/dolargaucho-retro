import React from "react";
import CurrencyConverter from "./currencyconverter";
import { FaHandshake } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Hero: React.FC = () => {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <section className="relative w-full text-center pt-40 pb-20 bg-gradient-to-b from-[#0a0f1a] to-[#141e30] text-white flex flex-col items-center overflow-hidden">
      
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image 
          src="/hero-bg.jpg" 
          alt="Dólar digital" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-10"
        />
      </div>

      {/* Partículas Fintech Elegantes */}
      <Particles
        className="absolute inset-0"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 100, density: { enable: true, area: 1000 } }, // Menos partículas, más organizadas
            shape: { type: "circle" }, // 🔵 Partículas en forma de círculo
            color: { value: ["#00b4d8", "#90e0ef", "#ffffff"] }, // Colores fintech elegantes
            opacity: { value: 0.2, random: true }, // Transparencia sutil
            size: { value: 3, random: true }, // Tamaño pequeño y elegante
            move: { 
              enable: true, 
              speed: 1, // Movimiento suave y lento
              random: true, 
              outModes: "out" 
            },
            line_linked: {
              enable: true, // 🔗 Conexión entre partículas
              distance: 100,
              color: "#ffff",
              opacity: 0.2,
              width: 1,
            },
          },
          interactivity: {
            events: { 
              onHover: { enable: true, mode: "grab" }, // 🔗 Se conectan al pasar el mouse
              onClick: { enable: true, mode: "push" },
            },
            modes: { 
              grab: { distance: 120, line_linked: { opacity: 0.3 } },
              push: { quantity: 2 },
            },
          },
        }}
      />

      {/* Contenido del Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }} 
        className="max-w-3xl mx-auto px-6 mb-8 relative z-10 text-center"
      >
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide text-[#00b4d8] font-web3">
          Dólar en Tiempo Real 🌐
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Con <span className="font-bold text-white">Dólar Gaucho</span>, accede a las últimas cotizaciones de <span className="text-[#90e0ef]">criptomonedas</span> y <span className="text-[#00b4d8]">dólares</span>.  
          <br /> ¡Descubre el futuro de las finanzas! 🚀
        </p>
        
        <motion.a 
          href="https://www.linkedin.com/in/tomymaritano"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(0, 180, 216, 0.7)" }}
          transition={{ duration: 0.3 }}
          className="relative px-6 py-3 font-bold text-white uppercase transition-all duration-300 bg-gradient-to-r from-[#00b4d8] to-[#90e0ef] rounded-lg shadow-lg flex items-center gap-2 hover:shadow-cyan-400/50 hover:-translate-y-1"
        >
          <FaHandshake /> Quiero colaborar
        </motion.a>
      </motion.div>

      {/* CurrencyConverter con animación flotante */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, delay: 0.5 }} 
        className="relative z-10 mt-10 w-full flex justify-center"
      >
        <CurrencyConverter />
      </motion.div>

    </section>
  );
};

export default Hero;