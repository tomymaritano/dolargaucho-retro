import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { FaCalendarAlt, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { Chart, registerables } from "chart.js";

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
        borderColor: "#f7931a",
        backgroundColor: "rgba(247, 147, 26, 0.3)",
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#f7931a",
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
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw as number; // 💡 Conversión explícita
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
          callback: (value: any) => `ARS ${value}`,
        },
      },
      x: {
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        ticks: { color: "#fff" },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto text-white p-8 rounded-xl bg-gray-900 shadow-2xl border border-gray-800">
      <h2 className="text-3xl font-bold flex items-center gap-2 mb-6 text-orange-400">
        <FaChartLine /> Calculadora de Inflación en Tiempo Real
      </h2>

      {loading && <p className="text-lg text-orange-400">Cargando datos de inflación...</p>}
      {!loading && (
        <p className="text-lg text-orange-300">
          📊 Inflación interanual: {inflationRate.toFixed(2)}%
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col">
          <label className="text-lg font-semibold flex items-center gap-2">
            <FaMoneyBillWave /> Monto Inicial (ARS)
          </label>
          <input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className="p-3 text-xl font-semibold text-gray-900 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-semibold flex items-center gap-2">
            <FaCalendarAlt /> Años en el Futuro
          </label>
          <input
            type="number"
            value={years}
            min="1"
            max="30"
            onChange={(e) => setYears(Number(e.target.value))}
            className="p-3 text-xl font-semibold text-gray-900 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {!loading && (
        <div className="mt-6 p-4 bg-orange-600 text-center rounded-lg shadow-md">
          <h3 className="text-2xl font-bold">💰 Valor en {years} años</h3>
          <p className="text-3xl font-extrabold mt-2">ARS {futureValues[years]?.toFixed(2)}</p>
        </div>
      )}

      <div className="mt-6" style={{ height: "350px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}