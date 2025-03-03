import React, { useState, useEffect } from "react";
import { FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa";

const CountryRisk: React.FC = () => {
  const [riskToday, setRiskToday] = useState<number | null>(null);
  const [risk7Days, setRisk7Days] = useState<number | null>(null);
  const [risk30Days, setRisk30Days] = useState<number | null>(null);
  const [percentChange7, setPercentChange7] = useState<number | null>(null);
  const [percentChange30, setPercentChange30] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Riesgo País Data
  useEffect(() => {
    const fetchRiskHistorical = async () => {
      try {
        const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais");
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const sortedData = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

          setRiskToday(sortedData[0]?.valor ?? null);

          const last7Days = sortedData.slice(0, 7);
          const avg7Days = last7Days.reduce((acc, item) => acc + item.valor, 0) / last7Days.length;
          setRisk7Days(avg7Days);

          const last30Days = sortedData.slice(0, 30);
          const avg30Days = last30Days.reduce((acc, item) => acc + item.valor, 0) / last30Days.length;
          setRisk30Days(avg30Days);

          // Calcular cambio porcentual
          if (sortedData[0]?.valor) {
            setPercentChange7(((sortedData[0]?.valor - avg7Days) / avg7Days) * 100);
            setPercentChange30(((sortedData[0]?.valor - avg30Days) / avg30Days) * 100);
          }
        } else {
          setError("No disponible");
        }
      } catch (err) {
        setError("Error al obtener datos");
      } finally {
        setLoading(false);
      }
    };

    fetchRiskHistorical();
  }, []);

  // 🔹 Determinar Tendencia y Color para los porcentajes
  const getTrend = (percentChange: number | null) => {
    if (percentChange === null) return { color: "text-gray-400", icon: null };
    if (percentChange > 0) return { color: "text-red-500", icon: <FaArrowUp /> };
    if (percentChange < 0) return { color: "text-green-400", icon: <FaArrowDown /> };
    return { color: "text-yellow-400", icon: null };
  };

  const trend7Days = getTrend(percentChange7);
  const trend30Days = getTrend(percentChange30);

  return (
    <div className="bg-[#1e2336] border border-gray-800 rounded-xl p-5 text-center shadow-lg w-full max-w-[320px] transition-all hover:scale-105 hover:border-purple-500">
      <h2 className="text-xs font-medium text-gray-400 flex items-center justify-center gap-1 uppercase tracking-wide">
        <FaChartLine className="text-blue-400 text-sm" /> Riesgo País Argentina
      </h2>

      {loading ? (
        <p className="text-gray-400 mt-3 text-sm">Cargando...</p>
      ) : error ? (
        <p className="text-red-400 mt-3 text-sm">{error}</p>
      ) : (
        <>
          {/* 🔹 Valor de Hoy */}
          <p className="text-4xl font-extrabold text-[#A78BFA] mt-3 drop-shadow-md">{riskToday?.toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-2">Hoy</p>

          {/* 🔹 Últimos 7 días */}
          <div className="mt-3 flex justify-between items-center text-sm">
            <span className="text-gray-300">Últimos 7 días:</span>
            <span className={`font-semibold ${trend7Days.color} flex items-center gap-1`}>
              {risk7Days?.toFixed(2)} ({percentChange7?.toFixed(2)}%) {trend7Days.icon}
            </span>
          </div>

          {/* 🔹 Últimos 30 días */}
          <div className="mt-2 flex justify-between items-center text-sm">
            <span className="text-gray-300">Últimos 30 días:</span>
            <span className={`font-semibold ${trend30Days.color} flex items-center gap-1`}>
              {risk30Days?.toFixed(2)} ({percentChange30?.toFixed(2)}%) {trend30Days.icon}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CountryRisk;