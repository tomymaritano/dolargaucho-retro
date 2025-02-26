import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-xl 
      ${isScrolled ? "bg-black/80 border-b border-gray-800" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Nombre de la App con estilo Grok */}
        <Link href="/">
          <span className="text-2xl font-bold tracking-tight text-white uppercase">
            Dólar Gaucho
          </span>
        </Link>

        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-8 items-center text-lg">
          <Link href="#cotizacion" className="hover:text-blue-400 transition-all">
            Cotizaciones
          </Link>
          <Link href="#conversor" className="hover:text-blue-400 transition-all">
            Conversor
          </Link>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="https://www.linkedin.com/in/tomasmaritano"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 font-bold text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-all"
          >
            🚀 Aportar Valor
          </motion.a>
        </div>

        {/* Menú Mobile */}
        <button className="md:hidden text-white text-3xl" onClick={() => setIsOpen(true)}>
          <FaBars />
        </button>
      </div>

      {/* Menú Mobile Fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center text-4xl font-bold text-white"
          >
            <button className="absolute top-6 right-6 text-white text-5xl" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
            <Link href="#cotizacion" className="mb-6 hover:text-blue-400" onClick={() => setIsOpen(false)}>
              Cotizaciones
            </Link>
            <Link href="#conversor" className="mb-6 hover:text-blue-400" onClick={() => setIsOpen(false)}>
              Conversor
            </Link>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="https://www.linkedin.com/in/tomasmaritano"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 text-lg bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
            >
              🚀 Aportar Valor
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;