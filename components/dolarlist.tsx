import React, { useState, useEffect } from "react";
import {
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";
import {
  LuBuilding2,
  LuBanknote,
  LuTrendingUp,
  LuBitcoin,
  LuClock,
} from "react-icons/lu"; // ÍCONOS MEJORADOS

// Interface para los datos del dólar
interface DolarData {
  compra: number;
  venta: number;
  nombre: string;
  fechaActualizacion: string;
}

// Íconos para cada tipo de cambio
const dolarIcons: Record<string, React.ReactNode> = {
  Oficial: <LuBuilding2 className="text-cyan-400 text-3xl" />,
  Blue: <LuBanknote className="text-blue-500 text-3xl" />,
  MEP: <LuTrendingUp className="text-green-400 text-3xl" />,
  CCL: <LuTrendingUp className="text-purple-500 text-3xl" />,
  Crypto: <LuBitcoin className="text-yellow-400 text-3xl" />,
};

// Renombrar nombres largos
const formatName = (name?: string): string => {
  if (!name) return "Desconocido";
  if (name.toLowerCase().includes("contado con liquidación")) return "CCL";
  return name;
};

// Formatear moneda ARS
const formatCurrency = (value?: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
};

// Formatear fecha
const formatDate = (dateString?: string): string => {
  if (!dateString) return "Fecha no disponible";
  const date = new Date(dateString);
  return date.toLocaleString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DolarList: React.FC = () => {
  const [dolares, setDolares] = useState<DolarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

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
    try {
      await navigator.clipboard.writeText(
        `💰 ${formatName(dolar.nombre)}:\n🟢 Compra: ${formatCurrency(
          dolar.compra
        )} | 🔴 Venta: ${formatCurrency(dolar.venta)}\n📅 Última actualización: ${formatDate(
          dolar.fechaActualizacion
        )}`
      );
      setCopied(dolar.nombre);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  const handleShare = async (dolar: DolarData) => {
    if (navigator?.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: `Cotización ${formatName(dolar.nombre)}`,
          text: `💰 ${formatName(dolar.nombre)} hoy:\n🟢 Compra: ${formatCurrency(
            dolar.compra
          )} | 🔴 Venta: ${formatCurrency(dolar.venta)}\n📅 Última actualización: ${formatDate(
            dolar.fechaActualizacion
          )}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error al compartir:", error);
      } finally {
        setIsSharing(false);
      }
    } else {
      alert("Tu navegador no soporta la función de compartir.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      {loading && <p className="text-center text-gray-400 animate-pulse">Cargando...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {dolares.map((dolar, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-700 transition-all hover:bg-white/10 hover:backdrop-blur-md hover:shadow-lg"
          >
            {/* 🏛️ Ícono + Nombre */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3">
                {dolarIcons[formatName(dolar.nombre)] || <LuBuilding2 className="text-gray-500 text-3xl" />}
                <h3 className="text-lg font-semibold text-white">{formatName(dolar.nombre)}</h3>
              </div>
              {/* 📅 Fecha de actualización debajo del nombre */}
              <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                <LuClock className="text-gray-400" />
                <span>{formatDate(dolar.fechaActualizacion)}</span>
              </div>
            </div>

            {/* 💵 Valores Compra/Venta */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-green-400 text-base font-semibold tracking-wide">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                {formatCurrency(dolar.compra)}
              </div>
              <div className="flex items-center gap-2 text-red-400 text-base font-semibold tracking-wide">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                {formatCurrency(dolar.venta)}
              </div>
            </div>

            {/* 🔄 Botones */}
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <button
                onClick={() => handleShare(dolar)}
                disabled={isSharing}
                className={`text-white text-base transition-all hover:scale-110 hover:text-blue-400 ${
                  isSharing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaShareAlt />
              </button>

              <button
                onClick={() => handleCopy(dolar)}
                className={`text-white text-base transition-all hover:scale-110 ${
                  copied === dolar.nombre ? "text-green-400" : "hover:text-gray-300"
                }`}
              >
                <FaCopy />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DolarList;