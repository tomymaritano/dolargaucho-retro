'use client';

import React, { useState } from 'react';
import { useCotizacionesWithVariations } from '@/hooks/useCotizaciones';
import { useFavoritesStore } from '@/lib/store/favorites';
import { Card } from '@/components/ui/Card';
import { FaStar, FaRegStar, FaArrowUp, FaArrowDown, FaMinus, FaCopy, FaShareAlt, FaCheckCircle } from 'react-icons/fa';
import { logger } from '@/lib/utils/logger';

const CotizacionesInternacionales: React.FC = () => {
  const { data, isLoading, error } = useCotizacionesWithVariations();
  const { currencies: favoriteCurrencyIds, toggleCurrency } = useFavoritesStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (cotizacion: typeof data[0]) => {
    try {
      await navigator.clipboard.writeText(
        `${cotizacion.nombre}: Compra $${cotizacion.compra.toFixed(2)} | Venta $${cotizacion.venta.toFixed(2)}`
      );
      setCopiedId(cotizacion.moneda);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      logger.error('Error al copiar cotización', error, { component: 'CotizacionesInternacionales', moneda: cotizacion.moneda });
    }
  };

  const handleShare = async (cotizacion: typeof data[0]) => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Cotización ${cotizacion.nombre}`,
          text: `${cotizacion.nombre}: Compra $${cotizacion.compra.toFixed(2)} | Venta $${cotizacion.venta.toFixed(2)}`,
          url: window.location.href,
        });
      } catch (error) {
        logger.error('Error al compartir cotización', error, { component: 'CotizacionesInternacionales', moneda: cotizacion.moneda });
      }
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((cotizacion) => {
          const isFavorite = favoriteCurrencyIds.includes(cotizacion.moneda);
          const { trend, percentage, previousValue } = cotizacion.variation;

          const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
          const trendColor = trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';
          const trendBg = trend === 'up' ? 'bg-error/10' : trend === 'down' ? 'bg-success/10' : 'bg-warning/10';

          return (
            <Card key={cotizacion.moneda} variant="elevated" padding="lg" hover="glow">
              {/* Header: Name + Favorite */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    {cotizacion.nombre}
                  </h3>
                </div>
                <button
                  onClick={() => toggleCurrency(cotizacion.moneda)}
                  className={`p-2 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-accent-emerald/20 text-accent-emerald'
                      : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                  }`}
                  aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
                </button>
              </div>

              {/* Main Price - Venta destacado + Variation */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary">Precio de Venta</p>
                  {previousValue && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trendBg} ${trendColor}`}
                      title={`Ayer: $${previousValue.toFixed(2)}`}
                    >
                      <TrendIcon className="text-[10px]" />
                      <span className="text-[10px] font-bold tabular-nums">
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-4xl font-bold text-accent-emerald tabular-nums">
                  ${cotizacion.venta.toFixed(2)}
                </p>
              </div>

              {/* Secondary Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-panel/50 border border-border">
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Compra</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">
                    ${cotizacion.compra.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-panel/50 border border-border">
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Diferencia</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-bold text-foreground tabular-nums">
                      ${(cotizacion.venta - cotizacion.compra).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => handleCopy(cotizacion)}
                  className="flex-1 px-3 py-2 rounded-lg glass hover:bg-accent-emerald/10 transition-all text-secondary hover:text-accent-emerald flex items-center justify-center gap-2 text-xs font-medium"
                  title="Copiar cotización"
                >
                  {copiedId === cotizacion.moneda ? (
                    <>
                      <FaCheckCircle className="text-accent-emerald" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      Copiar
                    </>
                  )}
                </button>
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={() => handleShare(cotizacion)}
                    className="px-3 py-2 rounded-lg glass hover:bg-accent-emerald/10 transition-all text-secondary hover:text-accent-emerald"
                    title="Compartir cotización"
                  >
                    <FaShareAlt className="text-sm" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CotizacionesInternacionales;
