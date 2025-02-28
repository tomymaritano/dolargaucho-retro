import React, { useState, useEffect, useRef } from "react";
import { FaHandshake, FaGithub, FaChevronDown } from "react-icons/fa";
import useDolar from "@/hooks/useDolar";

const Hero: React.FC = () => {
  const { dolar, loading, error } = useDolar();
  const [selectedCurrency, setSelectedCurrency] = useState("Dólar Oficial");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDolar = dolar.find((tipo) => tipo.nombre === selectedCurrency);

  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative w-full text-center pt-60 pb-40 bg-gradient-to-b from-[#121826] to-[#1c1f2e] text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* 🔥 Círculo degradado amarillo */}
      <div className="absolute bottom-[-500px] w-[800px] h-[1000px] bg-gradient-to-b from-[#5B21B6] to-transparent rounded-full blur-3xl opacity-40"></div>

      {/* 📌 Contenido principal */}
      <div className="max-w-3xl mx-auto px-6 mb-8 relative z-10 text-center animate-fadeIn">
        <h1 className="text-5xl font-extrabold mb-6 tracking-wide text-gray-100 drop-shadow-lg">
          Cotización del Dólar en Tiempo Real 💰
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Con <span className="font-bold text-white">Dólar Gaucho</span>, consulta el precio actualizado del dólar: Oficial, Blue, MEP y más. 🚀
        </p>

        {/* 📌 Botones de acción */}
        <div className="flex justify-center gap-6 mt-6">
          <a
            href="https://www.linkedin.com/in/tomymaritano"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md backdrop-blur-lg"
          >
            <FaHandshake /> Quiero colaborar
          </a>

          <a
            href="https://github.com/tomymaritano"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#312E81] hover:bg-[#25245A] text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-md backdrop-blur-lg"
          >
            <FaGithub /> GitHub
          </a>
        </div>
      </div>

      {/* 📌 Tarjeta con resumen + Dropdown */}
      <div className="relative z-10 mt-10 w-full flex justify-center animate-fadeInUp">
        <div className="bg-[#181B2B] backdrop-blur-2xl rounded-xl p-6 w-full max-w-xl text-center">
          
          <h3 className="text-xl font-semibold text-gray-300">💸 Última Cotización</h3>
          
          {/* 📌 Dropdown personalizado */}
          <div className="relative mt-4" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="w-full flex justify-between items-center bg-[#252845] text-white py-3 px-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-[#323657] transition-all"
            >
              {selectedCurrency}
              <FaChevronDown className={`text-gray-300 transform transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} />
            </button>
            
            {/* Opciones del Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-[#252845] rounded-lg shadow-lg border border-[#3a3e5e] overflow-hidden">
                {dolar.map((tipo) => (
                  <button
                    key={tipo.nombre}
                    className="block w-full text-left px-4 py-3 text-gray-200 hover:bg-[#3A3E5E] transition-all"
                    onClick={() => {
                      setSelectedCurrency(tipo.nombre);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {tipo.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 📌 Cotización seleccionada */}
          {loading ? (
            <p className="text-gray-400 mt-4">Cargando...</p>
          ) : error ? (
            <p className="text-red-400 mt-4">Error al obtener datos</p>
          ) : selectedDolar ? (
            <p className="text-3xl font-extrabold text-[#A78BFA] mt-4">
              ${selectedDolar.venta.toFixed(2)}
            </p>
          ) : (
            <p className="text-gray-400 mt-4">Selecciona una opción</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;