import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { useTasaPlazoFijo } from '@/hooks/useFinanzas';
import { FaPercent, FaCalendarAlt, FaDollarSign, FaCalculator } from 'react-icons/fa';

export function CalculadoraPlazoFijo() {
  const [capital, setCapital] = useState<string>('100000');
  const [dias, setDias] = useState<number>(30);
  const [tasaPersonalizada, setTasaPersonalizada] = useState<string>('');
  const [usarTasaActual, setUsarTasaActual] = useState(true);

  const { data: tasas } = useTasaPlazoFijo();

  // Calcular rendimiento
  const resultado = useMemo(() => {
    const capitalNum = parseFloat(capital.replace(/\./g, ''));
    if (isNaN(capitalNum) || capitalNum <= 0) {
      return null;
    }

    // Determinar qué tasa usar
    let tna: number;
    if (usarTasaActual && tasas && tasas.length > 0) {
      // Usar la mejor tasa disponible (más alta) de los bancos
      const mejorTasa = tasas.reduce((max, current) => {
        if (!current.tnaClientes) return max;
        if (!max || !max.tnaClientes || current.tnaClientes > max.tnaClientes) {
          return current;
        }
        return max;
      }, tasas[0]);

      // Convertir de decimal a porcentaje (la API devuelve 0.38 para 38%)
      tna = (mejorTasa.tnaClientes || 0) * 100;
    } else {
      const tasaNum = parseFloat(tasaPersonalizada);
      if (isNaN(tasaNum) || tasaNum <= 0) {
        return null;
      }
      tna = tasaNum;
    }

    // Calcular interés simple: I = C * TNA * (días/365) / 100
    const interes = (capitalNum * tna * (dias / 365)) / 100;
    const total = capitalNum + interes;

    // TEA = ((1 + TNA/100)^(365/días) - 1) * 100
    const tea = (Math.pow(1 + tna / 100, 365 / dias) - 1) * 100;

    return {
      capital: capitalNum,
      tna,
      tea,
      dias,
      interes,
      total,
    };
  }, [capital, dias, tasaPersonalizada, usarTasaActual, tasas]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, '');
    return new Intl.NumberFormat('es-AR').format(parseInt(num) || 0);
  };

  const handleCapitalChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setCapital(cleaned);
  };

  const plazosComunes = [30, 60, 90, 180, 360];

  return (
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <div className="flex items-center gap-2">
          <FaCalculator className="text-accent-emerald text-xl" />
          <Card.Title>Calculadora de Plazo Fijo</Card.Title>
        </div>
        <p className="text-sm text-secondary mt-1">
          Calculá el rendimiento de tu plazo fijo tradicional
        </p>
      </Card.Header>

      <Card.Content>
        <div className="space-y-6">
          {/* Capital Inicial */}
          <div>
            <label className="block text-sm text-secondary mb-2">Capital Inicial</label>
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={formatNumber(capital)}
                onChange={(e) => handleCapitalChange(e.target.value)}
                placeholder="100.000"
                className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white text-lg font-semibold placeholder-secondary/50 focus:ring-2 focus:ring-accent-emerald/50 focus:outline-none"
              />
            </div>
            <p className="text-xs text-secondary mt-1">Monto en pesos argentinos</p>
          </div>

          {/* Plazo */}
          <div>
            <label className="block text-sm text-secondary mb-2">Plazo (días)</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {plazosComunes.map((plazo) => (
                <button
                  key={plazo}
                  onClick={() => setDias(plazo)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    dias === plazo
                      ? 'bg-accent-emerald text-dark'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {plazo}d
                </button>
              ))}
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                value={dias}
                onChange={(e) => setDias(parseInt(e.target.value) || 30)}
                min="1"
                max="3650"
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-secondary/50 focus:ring-2 focus:ring-accent-emerald/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Tasa */}
          <div>
            <label className="block text-sm text-secondary mb-2">Tasa de Interés (TNA)</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 glass rounded-lg cursor-pointer hover:bg-white/5">
                <input
                  type="radio"
                  checked={usarTasaActual}
                  onChange={() => setUsarTasaActual(true)}
                  className="text-accent-emerald focus:ring-accent-emerald"
                />
                <span className="text-white text-sm">
                  Usar tasa actual del mercado
                  {tasas?.[0]?.tnaClientes && (
                    <span className="text-accent-emerald ml-2 font-semibold">
                      {(tasas[0].tnaClientes * 100).toFixed(2)}%
                    </span>
                  )}
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 glass rounded-lg cursor-pointer hover:bg-white/5">
                <input
                  type="radio"
                  checked={!usarTasaActual}
                  onChange={() => setUsarTasaActual(false)}
                  className="text-accent-emerald focus:ring-accent-emerald"
                />
                <span className="text-white text-sm">Usar tasa personalizada</span>
              </label>

              {!usarTasaActual && (
                <div className="relative ml-6">
                  <FaPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="number"
                    value={tasaPersonalizada}
                    onChange={(e) => setTasaPersonalizada(e.target.value)}
                    placeholder="Ej: 45.5"
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-secondary/50 focus:ring-2 focus:ring-accent-emerald/50 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resultados */}
          {resultado && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-white font-semibold mb-3">Resultado</h4>

              {/* Capital + Interés */}
              <div className="p-4 bg-accent-emerald/10 border border-accent-emerald/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-secondary">Monto Final</span>
                  <span className="text-2xl font-bold text-accent-emerald">
                    {formatCurrency(resultado.total)}
                  </span>
                </div>
                <div className="text-xs text-secondary">
                  Capital: {formatCurrency(resultado.capital)} + Interés:{' '}
                  {formatCurrency(resultado.interes)}
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-secondary mb-1">TNA</div>
                  <div className="text-lg font-bold text-white">{resultado.tna.toFixed(2)}%</div>
                </div>

                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-secondary mb-1">TEA</div>
                  <div className="text-lg font-bold text-white">{resultado.tea.toFixed(2)}%</div>
                </div>

                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-secondary mb-1">Plazo</div>
                  <div className="text-lg font-bold text-white">{resultado.dias} días</div>
                </div>

                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-secondary mb-1">Rendimiento</div>
                  <div className="text-lg font-bold text-accent-emerald">
                    +{((resultado.interes / resultado.capital) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {!resultado && (
            <div className="text-center py-8 text-secondary">
              <FaCalculator className="text-4xl mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ingresá los valores para calcular</p>
            </div>
          )}
        </div>
      </Card.Content>

      <Card.Footer>
        <div className="flex items-start gap-2 text-xs text-secondary">
          <span>ℹ️</span>
          <p>
            <strong>TNA</strong> (Tasa Nominal Anual): tasa sin capitalización. <strong>TEA</strong>{' '}
            (Tasa Efectiva Anual): tasa con capitalización anual. Los cálculos son aproximados y
            pueden variar según el banco.
          </p>
        </div>
      </Card.Footer>
    </Card>
  );
}
