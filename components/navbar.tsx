import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaRocket } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0a0f1a]/80 backdrop-blur-xl shadow-xl" : "bg-transparent"
      } border-b border-cyan-400/20`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo SVG */}
        <Link href="/">
          <Image src="/dolargaucho.svg" alt="Dólar Gaucho Logo" width={180} height={50} />
        </Link>

        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-8 items-center text-lg">
          <Link href="#cotizacion" className="hover:text-cyan-400 transition-all">
            Cotizaciones
          </Link>
          <Link href="#conversor" className="hover:text-cyan-400 transition-all">
            Conversor
          </Link>
          <motion.a
            whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.5)" }}
            href="https://www.linkedin.com/in/tomasmaritano"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-6 py-3 font-bold text-white uppercase transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg"
          >
            🚀 Aportar Valor
          </motion.a>
        </div>

        {/* Menú Mobile */}
        <button
          className="md:hidden text-cyan-300 text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes className="animate-spin" /> : <FaBars />}
        </button>
      </div>

      {/* Menú Mobile con framer-motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-64 bg-[#0a0f1a]/90 backdrop-blur-lg shadow-xl"
          >
            <button className="absolute top-5 right-5 text-white text-2xl" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-lg text-white">
              <Link href="#cotizacion" className="hover:text-cyan-400 transition-all" onClick={() => setIsOpen(false)}>
                Cotizaciones
              </Link>
              <Link href="#conversor" className="hover:text-cyan-400 transition-all" onClick={() => setIsOpen(false)}>
                Conversor
              </Link>
              <motion.a
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.5)" }}
                href="https://www.linkedin.com/in/tomasmaritano"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-6 py-3 font-bold text-white uppercase transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg"
              >
                🚀 Aportar Valor
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;