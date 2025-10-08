'use client';

import React from 'react';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { Card } from '@/components/ui/Card';
import { FaEuroSign, FaCoins, FaGlobeAmericas } from 'react-icons/fa';

const currencyIcons: Record<string, React.ReactNode> = {
  EUR: <FaEuroSign className="text-2xl" />,
  BRL: <FaGlobeAmericas className="text-2xl text-green-500" />,
  CLP: <FaGlobeAmericas className="text-2xl text-blue-500" />,
  UYU: <FaGlobeAmericas className="text-2xl text-blue-400" />,
};

const CotizacionesInternacionales: React.FC = () => {
  const { data, isLoading, error } = useCotizaciones();

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-emerald border-t-transparent" />
          <p className="text-sm text-secondary">Cargando cotizaciones internacionales...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-8">
          <p className="text-error">Error: {error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
          <span className="gradient-text">Cotizaciones Internacionales</span>
        </h2>
        <p className="text-secondary text-sm">Otras monedas en el mercado argentino</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((cotizacion) => (
          <Card key={cotizacion.moneda} variant="elevated" padding="md" hover="glow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 glass rounded-xl border border-accent-emerald/20">
                {currencyIcons[cotizacion.moneda] || <FaCoins className="text-2xl" />}
              </div>
              <span className="text-xs text-secondary px-2 py-1 glass rounded uppercase">
                {cotizacion.moneda}
              </span>
            </div>

            <h3 className="font-bold text-lg mb-1">{cotizacion.nombre}</h3>
            <p className="text-xs text-secondary mb-4">{cotizacion.casa}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass bg-accent-emerald/5 p-3 rounded-lg border border-accent-emerald/10">
                <p className="text-[10px] text-secondary mb-1 uppercase tracking-wider">Compra</p>
                <p className="font-mono font-bold text-accent-emerald text-base">
                  ${cotizacion.compra.toFixed(2)}
                </p>
              </div>
              <div className="glass bg-accent-teal/5 p-3 rounded-lg border border-accent-teal/10">
                <p className="text-[10px] text-secondary mb-1 uppercase tracking-wider">Venta</p>
                <p className="font-mono font-bold text-accent-teal text-base">
                  ${cotizacion.venta.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[10px] text-secondary text-center">
                {new Date(cotizacion.fechaActualizacion).toLocaleString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CotizacionesInternacionales;
