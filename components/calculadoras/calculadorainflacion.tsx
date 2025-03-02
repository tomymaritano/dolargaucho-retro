import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { Chart, registerables, TooltipItem } from "chart.js";

Chart.register(...registerables);

export default function InflationCalculator() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState<number>(84.5);
  const [years, setYears] = useState(5);
  const [futureValues, setFutureValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false); // Hidden by default
  const [showExplanation, setShowExplanation] = useState(false); // Explanation dropdown

  useEffect(() => {
    const fetchInflationRate = async () => {
      try {
        const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual");
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
          label: (tooltipItem: TooltipItem<"line">) => {
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
    <div className="mx-auto text-white p-10 rounded-xl max-w-7xl">
      
      {/* 📌 Title & Explanation Dropdown */}
      <h2 className="text-4xl font-bold flex items-center gap-3 mb-6 text-purple-400">
        <FaChartLine /> Calculadora de Inflación
      </h2>

      {/* 🔽 Toggleable Explanation */}
      <div className="mb-6 p-4 bg-[#22243A] rounded-lg shadow-md text-gray-300 text-sm md:text-base">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex justify-between items-center font-semibold text-white hover:text-purple-400 transition-all"
        >
          ¿Qué hace esta calculadora?
          <FaChevronDown className={`transition-transform ${showExplanation ? "rotate-180" : "rotate-0"}`} />
        </button>
        
        {showExplanation && (
          <div className="mt-3 transition-opacity opacity-100">
            <p>📢 Estima cuánto perderá tu dinero debido a la inflación en Argentina.</p>
            <p className="mt-2">
              Ingresa un <strong className="text-white">monto inicial</strong> y selecciona los <strong className="text-white">años</strong> para ver cuánto valdrá en términos reales.
            </p>
            <p className="mt-2">📊 Visualiza la proyección en un gráfico interactivo.</p>
          </div>
        )}
      </div>

      {/* 📌 Inflation Data */}
      {loading ? (
        <p className="text-lg text-yellow-400">Cargando datos de inflación...</p>
      ) : (
        <p className="text-lg text-gray-300">
          📊 Inflación Interanual: <span className="font-bold text-purple-400">{inflationRate.toFixed(2)}%</span>
        </p>
      )}

      {/* 🔹 Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Initial Amount */}
        <div className="flex flex-col bg-[#22243A] p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
          <label className="text-lg font-semibold flex items-center gap-2 text-gray-200">
            <FaMoneyBillWave /> Monto Inicial (ARS)
          </label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className="p-3 text-xl font-semibold text-gray-900 rounded-lg mt-2 border border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Years in the Future */}
        <div className="flex flex-col bg-[#22243A] p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
          <label className="text-lg font-semibold flex items-center gap-2 text-gray-200">
            <FaCalendarAlt /> Años en el Futuro
          </label>
          <input
            type="number"
            value={years}
            min="1"
            max="30"
            onChange={(e) => setYears(Number(e.target.value))}
            className="p-3 text-xl font-semibold text-gray-900 rounded-lg mt-2 border border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* 🔘 Toggle Button - Hidden by Default */}
      <button
        onClick={() => setShowResults(!showResults)}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-md"
      >
        {showResults ? <FaEyeSlash /> : <FaEye />} {showResults ? "Ocultar" : "Mostrar"} Resultados
      </button>

      {/* 💰 Result Card */}
      {showResults && !loading && (
        <div className="mt-6 p-6 bg-gray-900 text-center rounded-xl transition-all hover:scale-105">
          <h3 className="text-2xl font-bold text-white">💰 Valor en {years} años</h3>
          <p className="text-3xl font-extrabold mt-2 text-white">ARS {futureValues[years]?.toFixed(2)}</p>
        </div>
      )}

      {/* 📊 Chart */}
      {showResults && (
        <div className="mt-8 bg-[#22243A] p-6 rounded-xl shadow-md transition-all hover:shadow-2xl">
          <h3 className="text-lg font-semibold text-gray-300 text-center">📊 Proyección de Inflación</h3>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}