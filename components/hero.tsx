// components/Hero.tsx
import React from 'react';
import CurrencyConverter from './currencyconverter';
import { FaWallet } from 'react-icons/fa';

const Hero: React.FC = () => {
  return (
    <section className="w-full text-center pt-60 py-20 relative bg-black overflow-hidden flex flex-col items-center font-mono">
      {/* Fondo con efectos Retro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_rgba(255,0,128,0.3),_transparent_60%)] blur-3xl opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,255,255,0.3),_transparent_70%)] blur-2xl opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,0,0.2),_transparent_60%)] blur-3xl opacity-60"></div>
      
      <div className="max-w-3xl mx-auto px-6 mb-6 relative z-10 text-white flex flex-col items-center">
        <h1 className="text-6xl font-extrabold mb-6 text-yellow-300 tracking-wider drop-shadow-lg">Dólar Digital Retro</h1>
        <p className="text-lg text-yellow-400 mb-6">Conéctate al futuro con un toque nostálgico. Gestiona tus cotizaciones con estilo.</p>
        <a href="https://www.linkedin.com/in/tomymaritano" target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-pink-500 transform hover:scale-105 border border-yellow-500">
          <FaWallet /> Quiero colaborar
        </a>
      </div>
      <div className="relative z-10 mt-10 w-full flex justify-center">
        <CurrencyConverter />
      </div>
    </section>
  );
};

export default Hero;