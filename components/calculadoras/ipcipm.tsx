import React, { useState } from 'react';
import { FaChartBar } from 'react-icons/fa';

const InflationCalculator: React.FC = () => {
  const [priceBaseIPC, setPriceBaseIPC] = useState<string>('');
  const [priceCurrentIPC, setPriceCurrentIPC] = useState<string>('');
  const [priceBaseIPM, setPriceBaseIPM] = useState<string>('');
  const [priceCurrentIPM, setPriceCurrentIPM] = useState<string>('');

  const [ipc, setIpc] = useState<number | null>(null);
  const [ipm, setIpm] = useState<number | null>(null);
  const [variation, setVariation] = useState<number | null>(null);

  const calculateInflation = () => {
    const baseIPC = parseFloat(priceBaseIPC);
    const currentIPC = parseFloat(priceCurrentIPC);
    const baseIPM = parseFloat(priceBaseIPM);
    const currentIPM = parseFloat(priceCurrentIPM);

    if (!baseIPC || !currentIPC || !baseIPM || !currentIPM) return;

    // Cálculo del IPC
    const ipcValue = ((currentIPC - baseIPC) / baseIPC) * 100;

    // Cálculo del IPM
    const ipmValue = ((currentIPM - baseIPM) / baseIPM) * 100;

    // Variación entre IPC e IPM
    const variationValue = ipcValue - ipmValue;

    setIpc(ipcValue);
    setIpm(ipmValue);
    setVariation(variationValue);
  };

  return (
    <div className="mx-auto text-white p-6 md:p-10 rounded-2xl max-w-5xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaChartBar className="text-accent-emerald text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Herramienta
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Índice de <span className="gradient-text">Precios</span>
        </h2>
        <p className="text-secondary text-sm max-w-2xl mx-auto">
          Calcula IPC e IPM para análisis económico
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="glass-strong p-5 rounded-xl border border-white/5">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Precio Base IPC
          </label>
          <input
            type="number"
            value={priceBaseIPC}
            onChange={(e) => setPriceBaseIPC(e.target.value)}
            className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
            placeholder="100"
          />
        </div>

        <div className="glass-strong p-5 rounded-xl border border-white/5">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Precio Actual IPC
          </label>
          <input
            type="number"
            value={priceCurrentIPC}
            onChange={(e) => setPriceCurrentIPC(e.target.value)}
            className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
            placeholder="150"
          />
        </div>

        <div className="glass-strong p-5 rounded-xl border border-white/5">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Precio Base IPM
          </label>
          <input
            type="number"
            value={priceBaseIPM}
            onChange={(e) => setPriceBaseIPM(e.target.value)}
            className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
            placeholder="100"
          />
        </div>

        <div className="glass-strong p-5 rounded-xl border border-white/5">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Precio Actual IPM
          </label>
          <input
            type="number"
            value={priceCurrentIPM}
            onChange={(e) => setPriceCurrentIPM(e.target.value)}
            className="w-full p-3 text-lg font-mono font-semibold bg-dark-light border border-white/5 rounded-lg focus:ring-1 focus:ring-accent-emerald focus:outline-none transition-all text-white"
            placeholder="130"
          />
        </div>
      </div>

      {/* Botón de Cálculo */}
      <button
        onClick={calculateInflation}
        className="w-full mb-6 bg-accent-emerald hover:bg-accent-teal text-dark py-3 rounded-lg font-semibold transition-all text-sm"
      >
        Calcular IPC / IPM
      </button>

      {/* Resultados */}
      {ipc !== null && ipm !== null && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 glass-strong rounded-xl border border-accent-emerald/20 text-center">
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">IPC</p>
            <p className="text-3xl font-mono font-bold text-accent-emerald">{ipc.toFixed(2)}%</p>
          </div>
          <div className="p-5 glass-strong rounded-xl border border-accent-teal/20 text-center">
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">IPM</p>
            <p className="text-3xl font-mono font-bold text-accent-teal">{ipm.toFixed(2)}%</p>
          </div>
          <div
            className={`p-5 glass-strong rounded-xl border ${variation && variation > 0 ? 'border-error/20' : 'border-success/20'} text-center`}
          >
            <p className="text-xs uppercase tracking-wider text-secondary mb-2">Variación</p>
            <p
              className={`text-3xl font-mono font-bold ${variation && variation > 0 ? 'text-error' : 'text-success'}`}
            >
              {variation?.toFixed(2)}%
            </p>
            <p className="text-xs text-secondary mt-1">
              {variation && variation > 0 ? 'Inflación' : 'Deflación'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InflationCalculator;
