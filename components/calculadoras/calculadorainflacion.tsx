import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { Chart, registerables, TooltipItem } from "chart.js";

Chart.register(...registerables);

export default function InflationCalculator() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState<number>(84.5);
  const [years, setYears] = useState(5);
  const [futureValues, setFutureValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInflationRate = async () => {
      try {
        const response = await fetch(
          "https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual"
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const lastValue = data[data.length - 1];
          setInflationRate(lastValue.valor);
        }
      } catch (error) {
        console.error("Error al obtener la inflación:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInflationRate();
  }, []);

  useEffect(() => {
    const values: number[] = [];
    for (let i = 0; i <= years; i++) {
      values.push(initialAmount / Math.pow(1 + inflationRate / 100, i));
    }
    setFutureValues(values);
  }, [initialAmount, inflationRate, years]);

  const chartData = {
    labels: Array.from({ length: years + 1 }, (_, i) => `${i} año${i === 1 ? "" : "s"}`),
    datasets: [
      {
        label: "Valor Ajustado por Inflación",
        data: futureValues,
        borderColor: "#A78BFA",
        backgroundColor: "rgba(167, 139, 250, 0.3)",
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#A78BFA",
        pointBorderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => {
            const value = tooltipItem.raw as number;
            return `ARS ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        ticks: {
          color: "#fff",
          callback: (value: number | string) => `ARS ${value}`,
        },
      },
      x: {
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto text-white p-8 rounded-xl bg-gradient-to-b from-[#121826] to-[#1c1f2e] shadow-2xl border border-gray-800">
      <h2 className="text-3xl font-bold flex items-center gap-3 mb-6 text-purple-400">
        <FaChartLine /> Calculadora de Inflación en Tiempo Real
      </h2>

      {loading && <p className="text-lg text-yellow-400">Cargando datos de inflación...</p>}
      {!loading && (
        <p className="text-lg text-gray-300">
          📊 Inflación interanual: <span className="font-bold text-purple-400">{inflationRate.toFixed(2)}%</span>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Monto Inicial */}
        <div className="flex flex-col bg-gray-800 p-4 rounded-lg shadow-lg">
          <label className="text-lg font-semibold flex items-center gap-2 text-gray-200">
            <FaMoneyBillWave /> Monto Inicial (ARS)
          </label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className="p-3 text-xl font-semibold text-gray-900 rounded-lg mt-2 border border-gray-700 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Años en el Futuro */}
        <div className="flex flex-col bg-gray-800 p-4 rounded-lg shadow-lg">
          <label className="text-lg font-semibold flex items-center gap-2 text-gray-200">
            <FaCalendarAlt /> Años en el Futuro
          </label>
          <input
            type="number"
            value={years}
            min="1"
            max="30"
            onChange={(e) => setYears(Number(e.target.value))}
            className="p-3 text-xl font-semibold text-gray-900 rounded-lg mt-2 border border-gray-700 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* 📌 Tarjeta de resultado */}
      {!loading && (
        <div className="mt-6 p-6 bg-purple-600 text-center rounded-xl shadow-md">
          <h3 className="text-2xl font-bold">💰 Valor en {years} años</h3>
          <p className="text-3xl font-extrabold mt-2 text-white">ARS {futureValues[years]?.toFixed(2)}</p>
        </div>
      )}

      {/* 📊 Gráfico */}
      <div className="mt-6 bg-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-300 text-center">📊 Proyección de Inflación</h3>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}