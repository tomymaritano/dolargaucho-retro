import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaHandshake,
  FaChartLine,
  FaGlobeAmericas,
  FaMoneyBillWave,
  FaBalanceScale,
  FaExchangeAlt,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      label: "Cotizaciones",
      icon: <FaMoneyBillWave />,
      href: "/cotizaciones",
      subItems: [
        { label: "Dólar Blue", href: "/cotizaciones/dolar-blue" },
        { label: "Dólar Oficial", href: "/cotizaciones/dolar-oficial" },
        { label: "Cripto", href: "/cotizaciones/cripto" },
      ],
    },
    {
      label: "Economía",
      icon: <FaChartLine />,
      href: "/economia",
      subItems: [
        { label: "Inflación", href: "/economia/inflacion" },
        { label: "Riesgo País", href: "/economia/riesgo-pais" },
        { label: "Plazo Fijo", href: "/economia/plazo-fijo" },
      ],
    },
    {
      label: "Política",
      icon: <FaBalanceScale />,
      href: "/politica",
      subItems: [
        { label: "Senadores", href: "/politica/senadores" },
        { label: "Diputados", href: "/politica/diputados" },
        { label: "Elecciones", href: "/politica/elecciones" },
      ],
    },
    {
      label: "Estado",
      icon: <FaGlobeAmericas />,
      href: "/estado",
    },
    {
      label: "Conversor",
      icon: <FaExchangeAlt />,
      href: "/conversor",
    },
  ];

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "bg-[#121826]/80 shadow-lg" : "bg-[#121826]/60"
      } border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold cursor-pointer tracking-wide text-white">
          💸 Dólar Gaucho
        </Link>

        {/* Menú Desktop */}
        <div className="hidden md:flex space-x-6 items-center text-lg">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <button
                className="hover:text-[#A78BFA] flex items-center gap-2 transition-all"
                onClick={() => toggleDropdown(item.label)}
              >
                {item.icon} {item.label}
                {item.subItems && (
                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      activeDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown con mejor UI */}
              {item.subItems && activeDropdown === item.label && (
                <div className="absolute left-0 mt-2 w-52 bg-[#1c1f2e] text-gray-200 shadow-xl rounded-xl overflow-hidden border border-[#2D2F3E]">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block px-4 py-3 hover:bg-[#6D28D9] hover:text-white transition-all"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Botón Aportar Valor */}
          <a
            href="https://www.linkedin.com/in/tomymaritano"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#6D28D9] hover:bg-[#5B21B6] px-6 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all transform hover:scale-105"
          >
            <FaHandshake /> Aportar Valor
          </a>
        </div>

        {/* Menú Mobile */}
        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú Mobile Mejorado */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-[#1c1f2e]/95 p-6 absolute top-16 left-0 w-full shadow-xl transition-all duration-300">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                className="w-full text-white text-lg py-3 border-b border-gray-700 flex items-center justify-between"
                onClick={() => toggleDropdown(item.label)}
              >
                <span className="flex items-center gap-2">
                  {item.icon} {item.label}
                </span>
                {item.subItems && (
                  <FaChevronDown
                    className={`transition-transform ${
                      activeDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown en Mobile */}
              {item.subItems && activeDropdown === item.label && (
                <div className="bg-[#25273C] rounded-lg overflow-hidden">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className="block px-6 py-3 text-white border-b border-gray-700 hover:bg-[#6D28D9] transition-all"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Aportar Valor en Mobile */}
          <a
            href="https://www.linkedin.com/in/tomymaritano"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-[#6D28D9] hover:bg-[#5B21B6] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all transform hover:scale-105"
          >
            <FaHandshake /> Aportar Valor
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;