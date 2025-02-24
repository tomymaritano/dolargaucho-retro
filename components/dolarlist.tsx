import React, { useState, useEffect } from "react";
import {
  FaShareAlt,
  FaCopy,
  FaDollarSign,
  FaMoneyBillWave,
  FaBuilding,
  FaExchangeAlt,
  FaPiggyBank,
} from "react-icons/fa";

// Interface para los datos del dólar
interface DolarData {
  compra: number;
  venta: number;
  casa: string;
  nombre: string;
  moneda: string;
  fechaActualizacion: string;
}

// Íconos para cada tipo de dólar
const dolarIcons: Record<string, React.ReactNode> = {
  Oficial: <FaBuilding className="text-cyan-400" />,
  Blue: <FaMoneyBillWave className="text-blue-500" />,
  MEP: <FaExchangeAlt className="text-green-400" />,
  CCL: <FaPiggyBank className="text-purple-500" />,
  Crypto: <FaDollarSign className="text-yellow-400" />,
};

// Formatear número como moneda ARS
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);

const DolarList: React.FC = () => {
  const [dolares, setDolares] = useState<DolarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDolares = async () => {
      try {
        const response = await fetch("https://dolarapi.com/v1/cotizaciones");
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data: DolarData[] = await response.json();
        setDolares(data);
      } catch (error) {
        setError("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDolares();
  }, []);

  const handleCopy = async (dolar: DolarData) => {
    if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(
          `💰 ${dolar.nombre} hoy:\n\n🟢 Compra: ${formatCurrency(
            dolar.compra
          )}\n🔴 Venta: ${formatCurrency(
            dolar.venta
          )}\n\n📊 Consulta más en Dólar Gaucho: ${window.location.href}`
        );
        alert("Copiado al portapapeles");
      } catch (error) {
        console.error("Error al copiar:", error);
        alert("No se pudo copiar al portapapeles.");
      }
    } else {
      alert("Tu navegador no soporta la función de copiar.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">💸 Cotizaciones del Dólar</h2>

      {loading && <p className="text-center text-gray-400">Cargando...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dolares.map((dolar, index) => (
          <div
            key={index}
            className="p-4 sm:p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl w-full dark:bg-black/30"
          >
            {/* Ícono + Título */}
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              {dolarIcons[dolar.nombre] || <FaDollarSign className="text-gray-500" />}
              {dolar.nombre}
            </h3>

            {/* Valores de Compra y Venta */}
            <div className="flex justify-between items-center mt-4 py-2 text-base sm:text-lg font-semibold border-b border-gray-600">
              <p className="text-green-400">
                Compra: <span className="font-bold">{formatCurrency(dolar.compra)}</span>
              </p>
              <p className="text-red-400">
                Venta: <span className="font-bold">{formatCurrency(dolar.venta)}</span>
              </p>
            </div>

            {/* Fecha de actualización */}
            <p className="text-xs text-gray-400 mt-2 text-center">
              📅 {new Date(dolar.fechaActualizacion).toLocaleString("es-ES")}
            </p>

            {/* Botón de copiar */}
            <button
              onClick={() => handleCopy(dolar)}
              className="w-full mt-4 py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium text-white bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-gray-700"
            >
              <FaCopy /> Copiar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DolarList;