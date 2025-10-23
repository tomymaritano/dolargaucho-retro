import React, { useState } from 'react';
import { FaChartBar, FaEdit } from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { SectionHeader } from './SectionHeader';

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
    <div className="w-full text-foreground space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FaChartBar className="text-brand text-xl" />
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Herramienta
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
          Índice de <span className="gradient-text">Precios</span>
        </h2>
        <p className="text-secondary text-sm max-w-3xl mx-auto">
          Calcula IPC e IPM para análisis económico
        </p>
      </div>

      {/* Inputs Section */}
      <Card variant="elevated" padding="lg" className="border border-border">
        <SectionHeader
          icon={FaEdit}
          title="Datos de Entrada"
          subtitle="Ingresá los precios base y actuales"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            variant="solid"
            padding="md"
            className="border border-border hover:border-brand/40 transition-all duration-300"
          >
            <label
              htmlFor="price-base-ipc"
              className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block"
            >
              Precio Base IPC
            </label>
            <input
              id="price-base-ipc"
              type="number"
              value={priceBaseIPC}
              onChange={(e) => setPriceBaseIPC(e.target.value)}
              className="w-full p-3 text-lg font-mono font-semibold bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
              placeholder="100"
              aria-label="Precio base del Índice de Precios al Consumidor"
            />
          </Card>

          <Card
            variant="solid"
            padding="md"
            className="border border-border hover:border-brand/40 transition-all duration-300"
          >
            <label
              htmlFor="price-current-ipc"
              className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block"
            >
              Precio Actual IPC
            </label>
            <input
              id="price-current-ipc"
              type="number"
              value={priceCurrentIPC}
              onChange={(e) => setPriceCurrentIPC(e.target.value)}
              className="w-full p-3 text-lg font-mono font-semibold bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
              placeholder="150"
              aria-label="Precio actual del Índice de Precios al Consumidor"
            />
          </Card>

          <Card
            variant="solid"
            padding="md"
            className="border border-border hover:border-brand/40 transition-all duration-300"
          >
            <label
              htmlFor="price-base-ipm"
              className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block"
            >
              Precio Base IPM
            </label>
            <input
              id="price-base-ipm"
              type="number"
              value={priceBaseIPM}
              onChange={(e) => setPriceBaseIPM(e.target.value)}
              className="w-full p-3 text-lg font-mono font-semibold bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
              placeholder="100"
              aria-label="Precio base del Índice de Precios Mayoristas"
            />
          </Card>

          <Card
            variant="solid"
            padding="md"
            className="border border-border hover:border-brand/40 transition-all duration-300"
          >
            <label
              htmlFor="price-current-ipm"
              className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3 block"
            >
              Precio Actual IPM
            </label>
            <input
              id="price-current-ipm"
              type="number"
              value={priceCurrentIPM}
              onChange={(e) => setPriceCurrentIPM(e.target.value)}
              className="w-full p-3 text-lg font-mono font-semibold bg-panel border border-border rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground"
              placeholder="130"
              aria-label="Precio actual del Índice de Precios Mayoristas"
            />
          </Card>
        </div>

        {/* Botón de Cálculo */}
        <div className="mt-6">
          <Button
            onClick={calculateInflation}
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<FaChartBar />}
          >
            Calcular IPC / IPM
          </Button>
        </div>
      </Card>

      {/* Resultados */}
      {ipc !== null && ipm !== null && (
        <div className="space-y-4">
          <SectionHeader icon={FaChartBar} title="Resultados" subtitle="Índices calculados" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              variant="solid"
              padding="md"
              className="border border-brand/20 bg-brand/5 text-center hover:border-brand/40 hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-xs uppercase tracking-wider text-secondary mb-2">IPC</p>
              <p className="text-3xl font-mono font-bold text-brand">{ipc.toFixed(2)}%</p>
            </Card>

            <Card
              variant="solid"
              padding="md"
              className="border border-brand-light/20 bg-brand-light/5 text-center hover:border-brand-light/40 hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-xs uppercase tracking-wider text-secondary mb-2">IPM</p>
              <p className="text-3xl font-mono font-bold text-brand-light">{ipm.toFixed(2)}%</p>
            </Card>

            <Card
              variant="solid"
              padding="md"
              className={`border ${variation && variation > 0 ? 'border-error/20 bg-error/5' : 'border-success/20 bg-success/5'} text-center hover:border-${variation && variation > 0 ? 'error' : 'success'}/40 hover:scale-[1.02] transition-all duration-300`}
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
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default InflationCalculator;
