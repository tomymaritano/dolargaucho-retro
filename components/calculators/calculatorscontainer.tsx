import { useState } from "react";
import InvestmentCalculator from "../investmentcalculator";
import CryptoInvestmentCalculator from "./cryptoinvestmentcalculator";
import PurchasingPowerCalculator from "./purchasingpowercalculator";
import MepSavingsCalculator from "./mepsavingcalculator";
import CryptoMiningCalculator from "./cryptominingcalculator";
import RetirementCalculator from "./retirementcalculator";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalculator } from "react-icons/fa";

const calculators = [
  { name: "📈 USD", component: <InvestmentCalculator /> },
  { name: "🪙 Cripto", component: <CryptoInvestmentCalculator /> },
  { name: "💰 Poder", component: <PurchasingPowerCalculator /> },
  { name: "💵 MEP", component: <MepSavingsCalculator /> },
  { name: "⛏️ Minería", component: <CryptoMiningCalculator /> },
  { name: "🏦 Jubilación", component: <RetirementCalculator /> },
];

export default function CalculatorsContainer() {
  const [activeCalculator, setActiveCalculator] = useState(0);

  return (
    <div className="max-w-6xl mx-auto p-8 text-white">
      {/* Selector de Calculadoras */}
      <div className="flex overflow-x-auto gap-4 justify-center border-b border-gray-800 pb-6">
        {calculators.map((calc, index) => (
          <button
            key={index}
            onClick={() => setActiveCalculator(index)}
            className={`px-6 py-3 text-lg font-semibold rounded-xl transition-all duration-300 
              ${
                activeCalculator === index
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-110"
                  : "bg-gray-900 text-gray-300 hover:bg-cyan-500 hover:text-white"
              }`}
          >
            {calc.name}
          </button>
        ))}
      </div>

      {/* Renderizar la calculadora activa con animaciones suaves */}
      <div className="mt-10 p-8 rounded-xl bg-black/70 backdrop-blur-lg shadow-lg border border-gray-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCalculator}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="p-4 sm:p-6 rounded-xl"
          >
            {calculators[activeCalculator].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
