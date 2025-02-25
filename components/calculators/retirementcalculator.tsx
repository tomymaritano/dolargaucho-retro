import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";

// Registrar módulos de Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type Currency = "ARS" | "USD";
type DollarType = "oficial" | "blue" | "mep" | "ccb" | "cripto";

const dollarTypes: DollarType[] = ["oficial", "blue", "mep", "ccb", "cripto"];

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [monthlySavings, setMonthlySavings] = useState<number>(200);
  const [annualReturn, setAnnualReturn] = useState<number>(5);
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [dollarType, setDollarType] = useState<DollarType>("blue");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const dolarResponse = await axios.get("https://dolarapi.com/v1/dolares");
        const selectedDollar = dolarResponse.data.find((d: any) => d.nombre === dollarType)?.venta || 1;
        setExchangeRate(selectedDollar);
      } catch (error) {
        console.error("Error obteniendo el tipo de cambio:", error);
      }
    }
    if (currency === "ARS") fetchExchangeRate();
  }, [currency, dollarType]);

  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retirementAge, monthlySavings, annualReturn, currency, exchangeRate]);

  const calculateRetirement = () => {
    let savings = 0;
    let dataPoints = [];
    const years = retirementAge - currentAge;
    let savingsInUSD = monthlySavings;

    if (currency === "ARS") {
      savingsInUSD = monthlySavings / exchangeRate;
    }

    for (let year = 1; year <= years; year++) {
      savings = (savings + savingsInUSD * 12) * (1 + annualReturn / 100);
      dataPoints.push({ year: currentAge + year, savings: savings.toFixed(2) });
    }

    setTotalSavings(parseFloat(savings.toFixed(2)));

    setChartData({
      labels: dataPoints.map(d => d.year),
      datasets: [{
        label: `Ahorros proyectados (${currency})`,
        data: dataPoints.map(d => parseFloat(d.savings)),
        borderColor: "rgba(0, 255, 255, 1)",
        backgroundColor: "rgba(0, 255, 255, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(0, 255, 255, 1)",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3
      }]
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8backdrop-blur-lg rounded-2xl  shadow-2xl">

      {/* FORMULARIO RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[
          { label: "Edad Actual", value: currentAge, setValue: setCurrentAge },
          { label: "Edad de Jubilación", value: retirementAge, setValue: setRetirementAge },
          { label: "Ahorro Mensual", value: monthlySavings, setValue: setMonthlySavings },
          { label: "Rendimiento Anual (%)", value: annualReturn, setValue: setAnnualReturn }
        ].map(({ label, value, setValue }) => (
          <div key={label}>
            <label className="text-gray-300 text-lg font-semibold">{label}:</label>
            <input type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl text-center text-lg"/>
          </div>
        ))}
      </div>

      {/* MONEDA Y DÓLAR SELECCIÓN */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-gray-300 text-lg font-semibold">Moneda de Ahorro:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl text-lg">
            <option value="ARS">Pesos (ARS)</option>
            <option value="USD">Dólares (USD)</option>
          </select>
        </div>

        {currency === "ARS" && (
          <div className="flex-1">
            <label className="text-gray-300 text-lg font-semibold">Tipo de Dólar:</label>
            <select value={dollarType} onChange={(e) => setDollarType(e.target.value as DollarType)}
              className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl text-lg">
              {dollarTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* RESULTADO FINAL */}
      <div className="mt-8 p-6 bg-black/60 rounded-xl text-center border border-cyan-500 shadow-md">
        <p className="text-gray-300 text-xl">Ahorro Total Estimado ({currency})</p>
        <p className="text-white text-4xl font-bold mt-2">${totalSavings.toLocaleString()}</p>
      </div>

      {/* GRÁFICO RESPONSIVE */}
      {chartData && (
        <div className="mt-8 bg-black/30 p-4 sm:p-6 rounded-xl border border-blue-500">
          <h3 className="text-white text-xl font-semibold text-center mb-4">📊 Crecimiento de Ahorros</h3>
          <div className="w-full overflow-x-auto">
            <Line data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}