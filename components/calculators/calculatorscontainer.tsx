import { useState } from "react";
import InvestmentCalculator from "../investmentcalculator";
import CryptoInvestmentCalculator from "./cryptoinvestmentcalculator";
import PurchasingPowerCalculator from "./purchasingpowercalculator";
import MepSavingsCalculator from "./mepsavingcalculator";
import CryptoMiningCalculator from "./cryptominingcalculator";
import { motion, AnimatePresence } from "framer-motion"; // Animaciones suaves
import RetirementCalculator from "./retirementcalculator";

const calculators = [
  { name: "📈 USD", component: <InvestmentCalculator /> },
  { name: "🪙 Cripto", component: <CryptoInvestmentCalculator /> },
  { name: "💰 Poder", component: <PurchasingPowerCalculator /> },
  { name: "💵 MEP", component: <MepSavingsCalculator /> },
  { name: "⛏️ Minería", component: <CryptoMiningCalculator /> },
  { name: "⛏️ Jubilacion", component: <RetirementCalculator /> },
];

export default function CalculatorsContainer() {
  const [activeCalculator, setActiveCalculator] = useState(0);

  return (
    <div className="p-6  backdrop-blur-lg500 rounded-2xl text-white">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center uppercase tracking-wide text-blue-400">
        🔥 Calculadoras Financieras
      </h2>

      {/* Selector de Calculadoras - Scrollable en mobile */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 pb-2">
        {calculators.map((calc, index) => (
          <button
            key={index}
            onClick={() => setActiveCalculator(index)}
            className={`px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300
              ${
                activeCalculator === index
                  ? "bg-blue-500 text-white shadow-md scale-105 border border-blue-400"
                  : "bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white"
              }`}
          >
            {calc.name}
          </button>
        ))}
      </div>

      {/* Renderizar la calculadora activa con animaciones suaves */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCalculator}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 rounded-xl"
          >
            {calculators[activeCalculator].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}