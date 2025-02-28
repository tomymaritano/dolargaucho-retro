import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaClock, FaChartLine } from "react-icons/fa";
import useDolar from "@/hooks/useDolar";

const UnicoComponente: React.FC = () => {
  const { dolar, loading, error } = useDolar();
  const [selectedCurrency, setSelectedCurrency] = useState("Oficial");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [risk, setRisk] = useState<number | null>(null);
  const [riskLoading, setRiskLoading] = useState(true);
  const [riskError, setRiskError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Country Risk
  useEffect(() => {
    const fetchCountryRisk = async () => {
      try {
        const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo");
        const data = await response.json();
        if (data?.valor) {
          setRisk(data.valor);
        } else {
          setRiskError("No disponible");
        }
      } catch (err) {
        setRiskError("Error al obtener datos");
      } finally {
        setRiskLoading(false);
      }
    };

    fetchCountryRisk();
  }, []);

  // Sort Dólar Data (Ensure "Oficial" is First)
  const sortedDolar = [...dolar].sort((a, b) => (a.nombre === "Oficial" ? -1 : b.nombre === "Oficial" ? 1 : 0));
  const selectedDolar = sortedDolar.find((tipo) => tipo.nombre === selectedCurrency);

  // Format Date
  const formatFecha = (fecha: string | undefined) => {
    if (!fecha) return "Fecha no disponible";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + ` - ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} hs`;
  };

  // Close Dropdown on Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine Risk Level
  const getRiskStatus = (value: number | null) => {
    if (value === null) return { label: "Desconocido", color: "text-gray-400" };
    if (value < 500) return { label: "Bajo", color: "text-green-400" };
    if (value < 1000) return { label: "Moderado", color: "text-yellow-400" };
    return { label: "Alto", color: "text-red-500" };
  };

  const riskStatus = getRiskStatus(risk);

  return (
    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-3xl mx-auto">
      
      {/* 📌 Country Risk Card */}
      <div className="bg-[#1C1F2E]/80 backdrop-blur-md border border-gray-700 rounded-lg p-5 text-center shadow-md w-full max-w-[260px] h-[150px] flex flex-col justify-center">
        <h2 className="text-sm font-semibold text-gray-300 flex items-center justify-center gap-1">
          <FaChartLine className="text-blue-400 text-xs" /> Riesgo País Argentina
        </h2>

        {riskLoading ? (
          <p className="text-gray-400 text-center mt-2 animate-pulse">Cargando...</p>
        ) : riskError ? (
          <p className="text-red-400 text-center mt-2">{riskError}</p>
        ) : (
          <div className="mt-2">
            <p className="text-4xl font-extrabold text-[#A78BFA] drop-shadow-md leading-tight">
              {risk?.toLocaleString()}
            </p>
            <p className={`mt-1 text-sm font-semibold ${riskStatus.color}`}>
              Estado: {riskStatus.label}
            </p>
          </div>
        )}
      </div>

      {/* 📌 Dólar Dropdown */}
      <div className="bg-[#1C1F2E]/80 backdrop-blur-md border border-gray-700 rounded-lg p-5 w-full max-w-[260px] h-[150px] shadow-md flex flex-col justify-center">
        <div className="relative w-full" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="w-full flex justify-between items-center bg-[#252845] text-white py-3 px-4 rounded-md text-md font-semibold hover:bg-[#323657] transition-all shadow-sm"
          >
            {selectedCurrency}
            <FaChevronDown className={`transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`} />
          </button>

          {/* 📌 Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-[#252845] rounded-md shadow-xl border border-[#3a3e5e] overflow-hidden max-h-[200px] overflow-y-auto z-50 animate-fadeIn">
              {sortedDolar.map((tipo) => (
                <button
                  key={tipo.nombre}
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#3A3E5E] transition-all"
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

        {/* 📌 Selected Dólar Price */}
        {loading ? (
          <p className="text-gray-400 mt-3">Cargando...</p>
        ) : error ? (
          <p className="text-red-400 mt-3">Error al obtener datos</p>
        ) : selectedDolar ? (
          <>
            <p className="text-4xl font-bold text-[#A78BFA] mt-3 drop-shadow-md">
              ${selectedDolar.venta.toFixed(2)}
            </p>
            <p className="text-gray-400 text-sm mt-2 flex items-center justify-center gap-2">
              <FaClock className="text-yellow-400" /> {formatFecha(selectedDolar.fechaActualizacion)}
            </p>
          </>
        ) : (
          <p className="text-gray-400 mt-3">Selecciona una opción</p>
        )}
      </div>
    </div>
  );
};

export default UnicoComponente;