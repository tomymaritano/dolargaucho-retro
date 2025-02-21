import React from 'react';
import CurrencyConverter from './currencyconverter';
import { FaHandshake } from 'react-icons/fa';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full text-center pt-40 pb-20 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col items-center overflow-hidden">
      
      {/* Imagen de fondo con opacidad */}
      <div className="absolute inset-0">
        <Image 
          src="/images/hero-bg.jpg" 
          alt="Dólar digital" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-20"
        />
      </div>

      {/* Contenido del Hero */}
      <div className="max-w-3xl mx-auto px-6 mb-8 relative z-10 text-center animate-fadeIn">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide">Consulta el dólar en tiempo real 💰</h1>
        <p className="text-lg text-gray-200 mb-6">
          Con <span className="font-bold text-white">Dólar Gaucho</span> consulta el precio del dólar de manera rápida y gratuita. Cotizaciones oficiales, dólar blue, MEP y más. 🚀
        </p>
        
        <a href="https://www.linkedin.com/in/tomymaritano" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md"
        >
          <FaHandshake /> Quiero colaborar
        </a>
      </div>

      {/* CurrencyConverter con animación flotante */}
      <div className="relative z-10 mt-10 w-full flex justify-center animate-floating">
        <CurrencyConverter />
      </div>

    </section>
  );
};

export default Hero;