import React, { useState, useEffect } from "react";
import { FaDollarSign, FaArrowUp, FaArrowDown } from "react-icons/fa";

// ✅ Tipo de datos correcto para el array de cotizaciones
type DolarData = {
  casa: string;
  fecha: string;
  compra: number;
  venta: number;
  moneda: string;
};

const DolarComponent: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<DolarData[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("oficial");
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [rate7DaysAgo, setRate7DaysAgo] = useState<number | null>(null);
  const [rate30DaysAgo, setRate30DaysAgo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDolarData = async () => {
      try {
        const response = await fetch("https://api.argentinadatos.com/v1/cotizaciones/dolares");
        const data: DolarData[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // 🔹 Filtramos el array para obtener la última cotización de cada casa
          const latestRates = getLastRatesByCasa(data);

          setExchangeRates(latestRates);

          const selected = latestRates.find((d) => d.casa === selectedCurrency);
          setCurrentRate(selected ? selected.venta : null);

          // 🔹 Calculamos valores históricos
          setRate7DaysAgo(getHistoricalRate(data, selectedCurrency, 7));
          setRate30DaysAgo(getHistoricalRate(data, selectedCurrency, 30));
        } else {
          setError("No disponible");
        }
      } catch (err) {
        setError("Error al obtener datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDolarData();
  }, [selectedCurrency]);

  // 🔹 Obtiene la última cotización por cada casa
  const getLastRatesByCasa = (data: DolarData[]): DolarData[] => {
    const lastRates: Record<string, DolarData> = {};

    data.forEach((d) => {
      if (!lastRates[d.casa] || new Date(d.fecha) > new Date(lastRates[d.casa].fecha)) {
        lastRates[d.casa] = d;
      }
    });

    return Object.values(lastRates);
  };

  // 🔹 Obtiene la cotización más cercana a X días atrás
  const getHistoricalRate = (data: DolarData[], casa: string, daysAgo: number): number | null => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysAgo);

    const historicalData = data
      .filter((d) => d.casa === casa)
      .map((d) => ({
        ...d,
        dateDiff: Math.abs(new Date(d.fecha).getTime() - pastDate.getTime()), // Calculamos diferencia de días
      }));

    if (historicalData.length === 0) return null;

    const closestRate = historicalData.reduce((closest, current) =>
      current.dateDiff < closest.dateDiff ? current : closest
    );

    return closestRate.venta;
  };

  // 🔹 Determina si subió o bajó
  const getTrend = (current: number | null, past: number | null) => {
    if (current === null || past === null) return { label: "N/A", color: "text-gray-400", icon: null };
    if (current > past) return { label: "Subió", color: "text-red-500", icon: <FaArrowUp /> };
    if (current < past) return { label: "Bajó", color: "text-green-400", icon: <FaArrowDown /> };
    return { label: "Estable", color: "text-yellow-400", icon: null };
  };

  const trend7Days = getTrend(currentRate, rate7DaysAgo);
  const trend30Days = getTrend(currentRate, rate30DaysAgo);

  return (
    <div className="bg-[#1e2336] border border-gray-800 rounded-xl p-5 text-center shadow-lg w-full max-w-[320px] transition-all hover:scale-105 hover:border-purple-500">
      <h2 className="text-xs font-medium text-gray-400 flex items-center justify-center gap-1 uppercase tracking-wide">
        <FaDollarSign className="text-green-400 text-sm" /> Cotización del Dólar
      </h2>

      <div className="flex justify-center gap-2 mt-3">
        {exchangeRates.map((tipo) => (
          <button
            key={tipo.casa}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-all ${
              selectedCurrency === tipo.casa
                ? "bg-purple-500 text-white shadow-md"
                : "bg-[#252845] text-gray-300 hover:bg-[#323657]"
            }`}
            onClick={() => setSelectedCurrency(tipo.casa)}
          >
            {tipo.casa.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 mt-3 text-sm">Cargando...</p>
      ) : error ? (
        <p className="text-red-400 mt-3 text-sm">{error}</p>
      ) : (
        <>
          <p className="text-4xl font-extrabold text-[#A78BFA] mt-3 drop-shadow-md">
            ${currentRate?.toFixed(2)}
          </p>
          <p className="text-gray-400 text-xs mt-2">Última actualización</p>

          <div className="mt-3 flex justify-between items-center text-sm">
            <span className="text-gray-300">Hace 7 días:</span>
            <span className={`font-semibold ${trend7Days.color} flex items-center gap-1`}>
              {rate7DaysAgo !== null ? `$${rate7DaysAgo.toFixed(2)}` : "Sin datos"} {trend7Days.icon}
            </span>
          </div>

          <div className="mt-2 flex justify-between items-center text-sm">
            <span className="text-gray-300">Hace 30 días:</span>
            <span className={`font-semibold ${trend30Days.color} flex items-center gap-1`}>
              {rate30DaysAgo !== null ? `$${rate30DaysAgo.toFixed(2)}` : "Sin datos"} {trend30Days.icon}
            </span>
          </div>

          {rate7DaysAgo === null && rate30DaysAgo === null && (
            <p className="text-yellow-400 text-xs mt-3">
              ⚠️ **No hay datos almacenados para días anteriores en la API.**
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DolarComponent;