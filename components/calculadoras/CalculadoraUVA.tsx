import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { useUltimoUVA } from '@/hooks/useFinanzas';
import { FaHome, FaDollarSign, FaPercent, FaCalendarAlt, FaCalculator } from 'react-icons/fa';

export function CalculadoraUVA() {
  const [montoCredito, setMontoCredito] = useState<string>('50000000'); // 50M ARS
  const [plazoMeses, setPlazoMeses] = useState<number>(240); // 20 años
  const [tasaAnual, setTasaAnual] = useState<string>('8'); // 8% TNA típico para UVA
  const [variacionUVAAnual, setVariacionUVAAnual] = useState<string>('90'); // 90% anual estimado

  const { data: ultimoUVA } = useUltimoUVA();

  // Calcular cuota y evolución
  const resultado = useMemo(() => {
    const creditoNum = parseFloat(montoCredito.replace(/\./g, ''));
    const tasaNum = parseFloat(tasaAnual);
    const variacionNum = parseFloat(variacionUVAAnual);

    if (
      isNaN(creditoNum) ||
      creditoNum <= 0 ||
      isNaN(tasaNum) ||
      tasaNum <= 0 ||
      isNaN(variacionNum) ||
      plazoMeses <= 0 ||
      !ultimoUVA
    ) {
      return null;
    }

    // Convertir crédito a UVAs
    const valorUVAActual = ultimoUVA.valor;
    const creditoEnUVAs = creditoNum / valorUVAActual;

    // Calcular cuota en UVAs (sistema francés)
    const tasaMensual = tasaNum / 100 / 12;
    const cuotaEnUVAs =
      (creditoEnUVAs * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) /
      (Math.pow(1 + tasaMensual, plazoMeses) - 1);

    // Cuota inicial en pesos
    const cuotaInicialPesos = cuotaEnUVAs * valorUVAActual;

    // Proyección de cuota a diferentes plazos
    const variacionMensualUVA = variacionNum / 100 / 12;

    const proyecciones = [
      { mes: 1, uva: valorUVAActual, cuota: cuotaInicialPesos },
      {
        mes: 12,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, 12),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, 12),
      },
      {
        mes: 60,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, 60),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, 60),
      },
      {
        mes: 120,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, 120),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, 120),
      },
      {
        mes: plazoMeses,
        uva: valorUVAActual * Math.pow(1 + variacionMensualUVA, plazoMeses),
        cuota: cuotaEnUVAs * valorUVAActual * Math.pow(1 + variacionMensualUVA, plazoMeses),
      },
    ];

    // Total a pagar (simplificado - sin considerar amortización)
    const totalAPagar =
      cuotaInicialPesos * plazoMeses * Math.pow(1 + variacionMensualUVA, plazoMeses / 2);

    return {
      creditoEnPesos: creditoNum,
      creditoEnUVAs,
      valorUVAActual,
      cuotaEnUVAs,
      cuotaInicialPesos,
      tasaMensual: tasaMensual * 100,
      proyecciones,
      totalAPagar,
      plazoMeses,
      tasaAnual: tasaNum,
    };
  }, [montoCredito, plazoMeses, tasaAnual, variacionUVAAnual, ultimoUVA]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, '');
    return new Intl.NumberFormat('es-AR').format(parseInt(num) || 0);
  };

  const handleMontoChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setMontoCredito(cleaned);
  };

  const plazosComunes = [
    { meses: 120, label: '10 años' },
    { meses: 180, label: '15 años' },
    { meses: 240, label: '20 años' },
    { meses: 300, label: '25 años' },
    { meses: 360, label: '30 años' },
  ];

  return (
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <div className="flex items-center gap-2">
          <FaHome className="text-accent-emerald text-xl" />
          <Card.Title>Calculadora de Crédito UVA</Card.Title>
        </div>
        <p className="text-sm text-secondary mt-1">Simulá tu crédito hipotecario en UVAs</p>
      </Card.Header>

      <Card.Content>
        <div className="space-y-6">
          {/* UVA Actual */}
          {ultimoUVA && (
            <div className="p-4 bg-accent-emerald/10 border border-accent-emerald/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Valor UVA Actual</span>
                <span className="text-2xl font-bold text-accent-emerald">
                  {formatCurrency(ultimoUVA.valor)}
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">
                {new Date(ultimoUVA.fecha).toLocaleDateString('es-AR')}
              </p>
            </div>
          )}

          {/* Monto del Crédito */}
          <div>
            <label className="block text-sm text-secondary mb-2">Monto del Crédito</label>
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={formatNumber(montoCredito)}
                onChange={(e) => handleMontoChange(e.target.value)}
                placeholder="50.000.000"
                className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white text-lg font-semibold placeholder-secondary/50 focus:ring-2 focus:ring-accent-emerald/50 focus:outline-none"
              />
            </div>
            <p className="text-xs text-secondary mt-1">Monto total del crédito en pesos</p>
          </div>

          {/* Plazo */}
          <div>
            <label className="block text-sm text-secondary mb-2">Plazo del Crédito</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {plazosComunes.map((plazo) => (
                <button
                  key={plazo.meses}
                  onClick={() => setPlazoMeses(plazo.meses)}
                  className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all ${
                    plazoMeses === plazo.meses
                      ? 'bg-accent-emerald text-dark'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {plazo.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                value={plazoMeses}
                onChange={(e) => setPlazoMeses(parseInt(e.target.value) || 120)}
                min="12"
                max="480"
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-secondary/50 focus:ring-2 focus:ring-accent-emerald/50 focus:outline-none"
              />
            </div>
            <p className="text-xs text-secondary mt-1">Meses de duración del crédito</p>
          </div>

          {/* Tasa de Interés */}
          <div>
            <label className="block text-sm text-secondary mb-2">Tasa de Interés (TNA)</label>
            <div className="relative">
              <FaPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                value={tasaAnual}
                onChange={(e) => setTasaAnual(e.target.value)}
                placeholder="8"
                step="0.1"
                min="0"
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-secondary/50 focus:ring-2 focus:ring-accent-emerald/50 focus:outline-none"
              />
            </div>
            <p className="text-xs text-secondary mt-1">
              Típicamente entre 6% y 10% para créditos UVA
            </p>
          </div>

          {/* Variación UVA Estimada */}
          <div>
            <label className="block text-sm text-secondary mb-2">
              Variación UVA Anual Estimada
            </label>
            <div className="relative">
              <FaPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                value={variacionUVAAnual}
                onChange={(e) => setVariacionUVAAnual(e.target.value)}
                placeholder="90"
                step="1"
                min="0"
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-secondary/50 focus:ring-2 focus:ring-accent-emerald/50 focus:outline-none"
              />
            </div>
            <p className="text-xs text-secondary mt-1">
              Estimación conservadora de incremento anual de UVA
            </p>
          </div>

          {/* Resultados */}
          {resultado && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-white font-semibold mb-3">Resultados</h4>

              {/* Crédito en UVAs */}
              <div className="p-4 glass border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-secondary">Crédito en UVAs</span>
                  <span className="text-xl font-bold text-white">
                    {resultado.creditoEnUVAs.toLocaleString('es-AR', { maximumFractionDigits: 0 })}{' '}
                    UVAs
                  </span>
                </div>
                <div className="text-xs text-secondary">
                  Equivalente a {formatCurrency(resultado.creditoEnPesos)} hoy
                </div>
              </div>

              {/* Cuota Inicial */}
              <div className="p-4 bg-accent-emerald/10 border border-accent-emerald/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-secondary">Cuota Inicial (Mes 1)</span>
                  <span className="text-2xl font-bold text-accent-emerald">
                    {formatCurrency(resultado.cuotaInicialPesos)}
                  </span>
                </div>
                <div className="text-xs text-secondary">
                  {resultado.cuotaEnUVAs.toLocaleString('es-AR', { maximumFractionDigits: 2 })} UVAs
                  × ${resultado.valorUVAActual.toFixed(2)}
                </div>
              </div>

              {/* Proyección de Cuotas */}
              <div className="p-4 glass rounded-lg">
                <h5 className="text-sm text-secondary mb-3">Proyección de Cuota en el Tiempo</h5>
                <div className="space-y-2">
                  {resultado.proyecciones.map((proj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white/5 rounded"
                    >
                      <span className="text-xs text-secondary">
                        Mes {proj.mes} ({(proj.mes / 12).toFixed(1)} años)
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          {formatCurrency(proj.cuota)}
                        </div>
                        <div className="text-xs text-secondary">UVA: ${proj.uva.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-secondary mb-1">Tasa Mensual</div>
                  <div className="text-lg font-bold text-white">
                    {resultado.tasaMensual.toFixed(3)}%
                  </div>
                </div>

                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-secondary mb-1">Plazo Total</div>
                  <div className="text-lg font-bold text-white">{resultado.plazoMeses} meses</div>
                </div>
              </div>

              {/* Advertencia */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500 text-lg">⚠️</span>
                  <div className="flex-1 text-xs text-yellow-200">
                    <p className="font-semibold mb-1">Importante</p>
                    <p>
                      Esta simulación es aproximada. La cuota UVA aumenta con la inflación (índice
                      CER). Los valores reales pueden variar según las condiciones del banco y la
                      evolución de la UVA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!resultado && (
            <div className="text-center py-8 text-secondary">
              <FaCalculator className="text-4xl mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ingresá los valores para simular tu crédito UVA</p>
            </div>
          )}
        </div>
      </Card.Content>

      <Card.Footer>
        <div className="flex items-start gap-2 text-xs text-secondary">
          <span>ℹ️</span>
          <p>
            <strong>UVA</strong> (Unidad de Valor Adquisitivo): índice que se ajusta diariamente
            según el CER (inflación). Los créditos UVA mantienen el valor real de la deuda pero las
            cuotas aumentan con la inflación.
          </p>
        </div>
      </Card.Footer>
    </Card>
  );
}
