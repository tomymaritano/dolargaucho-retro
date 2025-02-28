import React, { useState, useEffect } from "react";

const CountryRisk: React.FC = () => {
  const [risk, setRisk] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest country risk data
  useEffect(() => {
    const fetchCountryRisk = async () => {
      try {
        const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo");
        const data = await response.json();
        if (data?.valor) {
          setRisk(data.valor);
        } else {
          setError("No disponible");
        }
      } catch (err) {
        setError("Error al obtener datos");
      } finally {
        setLoading(false);
      }
    };

    fetchCountryRisk();
  }, []);

  // Determine risk level
  const getRiskStatus = (value: number | null) => {
    if (value === null) return { label: "Desconocido", color: "text-gray-400" };
    if (value < 500) return { label: "Bajo", color: "text-green-400" };
    if (value < 1000) return { label: "Moderado", color: "text-yellow-400" };
    return { label: "Alto", color: "text-red-500" };
  };

  const riskStatus = getRiskStatus(risk);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[260px] bg-[#1C1F2E]/90 rounded-lg p-4 text-center shadow-lg">
        
        {/* Title */}
        <h2 className="text-sm font-semibold text-gray-300 flex items-center justify-center gap-1">
 Riesgo País Argentina
        </h2>

        {/* Risk Value */}
        {loading ? (
          <p className="text-gray-400 text-center mt-2 animate-pulse">Cargando...</p>
        ) : error ? (
          <p className="text-red-400 text-center mt-2">{error}</p>
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
    </div>
  );
};

export default CountryRisk;