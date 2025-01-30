// components/Navbar.tsx
import React, { useState } from 'react';
import { FaBars, FaTimes, FaHandshake } from 'react-icons/fa';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-purple-900 to-pink-700 shadow-lg border-b border-yellow-500 font-mono">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-3xl font-extrabold text-yellow-300 cursor-pointer tracking-widest drop-shadow-lg">
            Dólar Retro
          </span>
        </Link>
        
        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-8 text-yellow-400 font-semibold items-center text-lg">
          <Link href="#cotizacion" className="hover:text-pink-300 transition-all duration-300">Cotizaciones</Link>
          <Link href="#conversor" className="hover:text-pink-300 transition-all duration-300">Conversor</Link>
          <a href="https://www.linkedin.com/in/tomasmaritano" target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md shadow-yellow-500 transition-all duration-300 border border-yellow-400">
            <FaHandshake /> Aportar Valor
          </a>
        </div>
        
        {/* Menú Mobile */}
        <button className="md:hidden text-yellow-300 text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      {isOpen && (
        <div className="md:hidden flex flex-col bg-gradient-to-r from-purple-900 to-pink-700 p-6 absolute top-16 left-0 w-full shadow-xl border-t border-yellow-500">
          <Link href="#cotizacion" className="text-yellow-300 text-lg py-3 border-b border-yellow-400 hover:text-pink-300 transition-all duration-300" onClick={() => setIsOpen(false)}>Cotizaciones</Link>
          <Link href="#conversor" className="text-yellow-300 text-lg py-3 border-b border-yellow-400 hover:text-pink-300 transition-all duration-300" onClick={() => setIsOpen(false)}>Conversor</Link>
          <a href="https://www.linkedin.com/in/tomymaritano" target="_blank" rel="noopener noreferrer" className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-md shadow-yellow-500 transition-all duration-300 border border-yellow-400">
            <FaHandshake /> Aportar Valor
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
