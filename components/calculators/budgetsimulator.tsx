import { useState } from "react";

export default function BudgetSimulator() {
  const [income, setIncome] = useState<number>(500000);
  const [expenses, setExpenses] = useState<number>(300000);
  const savings = income - expenses;

  return (
    <div className="p-6 bg-black/50 backdrop-blur-lg rounded-2xl border border-blue-500 shadow-xl max-w-lg mx-auto">
      <h3 className="text-3xl font-bold text-white text-center mb-6">📊 Simulador de Presupuesto</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-gray-300 text-lg font-semibold">Ingresos Mensuales (ARS):</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl"
          />
        </div>

        <div>
          <label className="text-gray-300 text-lg font-semibold">Gastos Mensuales (ARS):</label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-blue-500 bg-black/40 text-white rounded-xl"
          />
        </div>
      </div>

      <p className="text-center text-white font-bold text-2xl mt-6">
        💰 Ahorro Mensual: {savings > 0 ? `+${savings} ARS` : `${savings} ARS`}
      </p>
    </div>
  );
}