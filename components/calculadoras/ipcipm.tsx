import React, { useState } from "react";

const InflationCalculator: React.FC = () => {
  const [priceBaseIPC, setPriceBaseIPC] = useState<string>("");
  const [priceCurrentIPC, setPriceCurrentIPC] = useState<string>("");
  const [priceBaseIPM, setPriceBaseIPM] = useState<string>("");
  const [priceCurrentIPM, setPriceCurrentIPM] = useState<string>("");

  const [ipc, setIpc] = useState<number | null>(null);
  const [ipm, setIpm] = useState<number | null>(null);
  const [variation, setVariation] = useState<number | null>(null);

  const calculateInflation = () => {
    const baseIPC = parseFloat(priceBaseIPC);
    const currentIPC = parseFloat(priceCurrentIPC);
    const baseIPM = parseFloat(priceBaseIPM);
    const currentIPM = parseFloat(priceCurrentIPM);

    if (!baseIPC || !currentIPC || !baseIPM || !currentIPM) return;

    // 🔢 Cálculo del IPC
    const ipcValue = ((currentIPC - baseIPC) / baseIPC) * 100;

    // 🔢 Cálculo del IPM
    const ipmValue = ((currentIPM - baseIPM) / baseIPM) * 100;

    // 🔢 Variación entre IPC e IPM
    const variationValue = ipcValue - ipmValue;

    setIpc(ipcValue);
    setIpm(ipmValue);
    setVariation(variationValue);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xs md:max-w-sm bg-[#1C1F2E]/90 backdrop-blur-lg p-6 rounded-xl shadow-md text-white">
      
      {/* 📌 Título */}
      <h3 className="text-md font-semibold text-gray-300 text-center">📊 Índice de Precios (IPC / IPM)</h3>

      {/* 📌 Inputs */}
      <div className="w-full space-y-2 mt-3">
        <label className="text-sm">💰 Precio Base IPC:</label>
        <input
          type="number"
          value={priceBaseIPC}
          onChange={(e) => setPriceBaseIPC(e.target.value)}
          className="p-2 rounded-md text-gray-900 w-full"
          placeholder="Ej: 100"
        />

        <label className="text-sm">📊 Precio Actual IPC:</label>
        <input
          type="number"
          value={priceCurrentIPC}
          onChange={(e) => setPriceCurrentIPC(e.target.value)}
          className="p-2 rounded-md text-gray-900 w-full"
          placeholder="Ej: 150"
        />

        <label className="text-sm">📦 Precio Base IPM:</label>
        <input
          type="number"
          value={priceBaseIPM}
          onChange={(e) => setPriceBaseIPM(e.target.value)}
          className="p-2 rounded-md text-gray-900 w-full"
          placeholder="Ej: 100"
        />

        <label className="text-sm">📦 Precio Actual IPM:</label>
        <input
          type="number"
          value={priceCurrentIPM}
          onChange={(e) => setPriceCurrentIPM(e.target.value)}
          className="p-2 rounded-md text-gray-900 w-full"
          placeholder="Ej: 130"
        />
      </div>

      {/* 📌 Botón de Cálculo */}
      <button
        onClick={calculateInflation}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-semibold transition-all w-full"
      >
        Calcular IPC / IPM
      </button>

      {/* 📌 Resultados con Mismo Diseño */}
      {ipc !== null && ipm !== null && (
        <div className="w-full bg-[#252845]/80 p-4 mt-4 rounded-lg shadow-lg text-center">
          <p className="text-3xl font-bold text-[#A78BFA] drop-shadow-md">📊 IPC: {ipc.toFixed(2)}%</p>
          <p className="text-2xl font-semibold text-gray-300 mt-1">📦 IPM: {ipm.toFixed(2)}%</p>
          <p
            className={`mt-2 text-lg font-semibold ${
              variation && variation > 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {variation?.toFixed(2)}% {variation && variation > 0 ? "⬆️ Inflación" : "⬇️ Deflación"}
          </p>
        </div>
      )}
    </div>
  );
};

export default InflationCalculator;