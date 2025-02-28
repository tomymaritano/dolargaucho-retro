import React, { useState, useEffect } from "react";
import useDolar from "@/hooks/useDolar";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaMoneyBillWave, FaChartLine } from "react-icons/fa";

Chart.register(...registerables);

export default function FinancialCalculator() {
  const { dolar, loading: dolarLoading, error: dolarError } = useDolar();
  const [inflationInterannual, setInflationInterannual] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [convertedUSD, setConvertedUSD] = useState<number | null>(null);
  const [inflationAdjusted, setInflationAdjusted] = useState<number | null>(null);
  const [inflationLoading, setInflationLoading] = useState(true);
  const [inflationError, setInflationError] = useState<string | null>(null);
  const [futureValues, setFutureValues] = useState<number[]>([]);

  // 🔥 Fetch de inflación interanual desde ArgentinaDatos
  useEffect(() => {
    const fetchInflation = async () => {
      try {
        const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setInflationInterannual(data[data.length - 1].valor);
        }
      } catch (error) {
        setInflationError("Error al obtener inflación interanual.");
      } finally {
        setInflationLoading(false);
      }
    };

    fetchInflation();
  }, []);

  // 🔥 Función para calcular valores y generar el gráfico
  const calculateResults = () => {
    if (!amount || isNaN(Number(amount))) return;
    const numericAmount = parseFloat(amount);
    const oficialDolar = dolar.find((tipo) => tipo.nombre === "Oficial")?.venta;

    if (oficialDolar) setConvertedUSD(numericAmount / oficialDolar);
    if (inflationInterannual) {
      setInflationAdjusted(numericAmount / Math.pow(1 + inflationInterannual / 100, 1));

      let values = [];
      for (let i = 0; i <= 5; i++) {
        values.push(numericAmount / Math.pow(1 + inflationInterannual / 100, i));
      }
      setFutureValues(values);
    }
  };

  // Datos del gráfico
  const chartData = {
    labels: ["Hoy", "1 año", "2 años", "3 años", "4 años", "5 años"],
    datasets: [
      {
        label: "ARS Ajustado por Inflación",
        data: futureValues,
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-900 rounded-xl text-white shadow-lg">
      <h2 className="text-3xl font-bold flex items-center gap-3 mb-6">
        <FaChartLine className="text-purple-400" /> Calculadora Financiera
      </h2>

      {/* 📌 Estado de carga */}
      {dolarLoading && <p className="text-lg text-yellow-400 text-center">Cargando cotización del dólar...</p>}
      {inflationLoading && <p className="text-lg text-yellow-400 text-center">Cargando inflación...</p>}
      {dolarError && <p className="text-lg text-red-500 text-center">{dolarError}</p>}
      {inflationError && <p className="text-lg text-red-500 text-center">{inflationError}</p>}

      {!dolarLoading && !dolarError && !inflationLoading && !inflationError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-gray-800 rounded-lg text-center">
            <p className="text-lg font-semibold">💵 Cotización USD Oficial:</p>
            <p className="text-3xl font-bold">
              {dolar.find((d) => d.nombre === "Oficial")?.venta
                ? `$${dolar.find((d) => d.nombre === "Oficial")?.venta.toFixed(2)}`
                : "N/A"}
            </p>
          </div>
          <div className="p-5 bg-gray-800 rounded-lg text-center">
            <p className="text-lg font-semibold">📈 Inflación Interanual:</p>
            <p className="text-3xl font-bold">{inflationInterannual ? `${inflationInterannual.toFixed(2)}%` : "N/A"}</p>
          </div>
        </div>
      )}

      {/* 📌 Input de monto */}
      <div className="mt-6">
        <label className="block mb-2 text-lg font-semibold">💰 Monto en ARS:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 text-lg text-gray-900 rounded-lg"
          placeholder="Ej: 100000"
        />
      </div>

      {/* 📌 Botón de cálculo */}
      <button
        onClick={calculateResults}
        className="w-full mt-4 bg-purple-600 p-3 rounded-lg hover:bg-purple-700 transition text-lg font-bold"
      >
        Calcular
      </button>

      {/* 📌 Resultados */}
      <div className="mt-6 space-y-4">
        {convertedUSD !== null && (
          <div className="p-5 bg-green-700 rounded-lg text-center">
            <p className="text-lg font-semibold">💵 Equivalente en USD:</p>
            <p className="text-3xl font-bold">${convertedUSD.toFixed(2)}</p>
          </div>
        )}

        {inflationAdjusted !== null && (
          <div className="p-5 bg-red-700 rounded-lg text-center">
            <p className="text-lg font-semibold">📉 Valor Ajustado por Inflación:</p>
            <p className="text-3xl font-bold">ARS {inflationAdjusted.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* 📊 Gráfico de inflación */}
      {futureValues.length > 0 && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-center">📊 Proyección de Inflación</h3>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}