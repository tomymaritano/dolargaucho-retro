import React from "react";
import useArgentinaData from "../hooks/useArgentinaData";

const ArgentinaDataComponent = () => {
  const { data, loading, error } = useArgentinaData();

  if (loading) return <p className="text-blue-400 text-lg text-center">Cargando datos...</p>;
  if (error) return <p className="text-red-500 text-lg font-semibold text-center">Error: {error}</p>;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-[#f7931a] text-center mb-8">📊 Datos Financieros y Económicos</h1>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Feriados */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">📅 Feriados 2025</h2>
          <ul className="mt-4 space-y-2">
            {data.feriados?.slice(0, 5).map((feriado: any, index: number) => (
              <li key={index} className="text-gray-300">
                <span className="font-semibold">{feriado.fecha}</span>: {feriado.motivo}
              </li>
            )) || <p>No hay datos disponibles</p>}
          </ul>
        </div>

        {/* Inflación */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">📉 Inflación</h2>
          <p className="text-xl font-bold mt-4">
            {data.inflacion ? `${data.inflacion.valor}%` : "No disponible"}
          </p>
        </div>

        {/* Riesgo País */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">📈 Riesgo País</h2>
          <p className="text-xl font-bold mt-4">
            {data.riesgoPaisUltimo ? `${data.riesgoPaisUltimo.valor}` : "No disponible"}
          </p>
        </div>

        {/* Tasa de Plazo Fijo */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">💰 Tasa Plazo Fijo</h2>
          <p className="text-xl font-bold mt-4">
            {data.tasasPlazoFijo ? `${data.tasasPlazoFijo.valor}%` : "No disponible"}
          </p>
        </div>

        {/* Rendimientos Buenbit */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">🟢 Rendimientos Buenbit</h2>
          <p className="text-xl font-bold mt-4">
            {data.rendimientosBuenbit ? `${data.rendimientosBuenbit.valor}%` : "No disponible"}
          </p>
        </div>

        {/* Senadores */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 text-white border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold">🏛️ Senadores</h2>
          <ul className="mt-4 space-y-2">
            {data.senadores?.slice(0, 3).map((senador: any, index: number) => (
              <li key={index} className="text-gray-300">
                <span className="font-semibold">{senador.nombre}</span> ({senador.partido})
              </li>
            )) || <p>No hay datos disponibles</p>}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ArgentinaDataComponent;