import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
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
        isScrolled ? "bg-black/90 backdrop-blur-lg shadow-lg" : "bg-transparent"
      } border-b border-cyan-400/20`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
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
            className="px-6 py-3 font-bold text-white uppercase bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg"
          >
            🚀 Aportar Valor
          </motion.a>
        </div>

        {/* Menú Mobile */}
        <button
          className="md:hidden text-cyan-300 text-3xl"
          onClick={() => setIsOpen(true)}
        >
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
            className="fixed inset-0 bg-black flex flex-col items-center justify-center text-3xl font-bold text-white"
          >
            <button
              className="absolute top-6 right-6 text-white text-4xl"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
            <Link href="#cotizacion" className="mb-6 hover:text-cyan-400" onClick={() => setIsOpen(false)}>
              Cotizaciones
            </Link>
            <Link href="#conversor" className="mb-6 hover:text-cyan-400" onClick={() => setIsOpen(false)}>
              Conversor
            </Link>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="https://www.linkedin.com/in/tomasmaritano"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg"
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
