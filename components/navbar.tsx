import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHandshake } from 'react-icons/fa';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detecta el scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-blue-900 shadow-xl' : 'bg-blue-900/90'} border-b border-blue-700/50`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-extrabold cursor-pointer tracking-wide">💸 Dólar Gaucho</span>
        </Link>
        
        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-8 items-center text-lg">
          <Link href="#cotizacion" className="hover:text-blue-400 transition-all">Cotizaciones</Link>
          <Link href="#conversor" className="hover:text-blue-400 transition-all">Conversor</Link>
          <a href="https://www.linkedin.com/in/tomasmaritano" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all transform hover:scale-105"
          >
            <FaHandshake /> Aportar Valor
          </a>
        </div>
        
        {/* Menú Mobile */}
        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      {/* Menú Mobile desplegable */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-blue-800/90 p-6 absolute top-16 left-0 w-full shadow-xl animate-slideDown transition-all duration-300">
          <Link href="#cotizacion" className="text-white text-lg py-3 border-b border-blue-700 hover:text-blue-400 transition-all" onClick={() => setIsOpen(false)}>Cotizaciones</Link>
          <Link href="#conversor" className="text-white text-lg py-3 border-b border-blue-700 hover:text-blue-400 transition-all" onClick={() => setIsOpen(false)}>Conversor</Link>
          <a href="https://www.linkedin.com/in/tomasmaritano" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="mt-4 bg-blue-500 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all transform hover:scale-105"
          >
            <FaHandshake /> Aportar Valor
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;