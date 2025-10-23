/**
 * FavoriteCryptoRow Component
 *
 * Renders a single crypto favorite row with actions and expandable chart
 * Extracted from FavoritesList.tsx for better separation of concerns
 */

import React, { useCallback } from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import {
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaShareAlt,
  FaCopy,
  FaChartLine,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import { useCryptoHistoricoRange } from '@/hooks/useCryptoHistoricalRange';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

interface FavoriteCryptoRowProps {
  crypto: CryptoData;
  selectedDolar?: Quotation;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
}

/**
 * Expanded chart component for a specific cryptocurrency
 */
function ExpandedCryptoChart({ cryptoId, name }: { cryptoId: string; name: string }) {
  const { data: chartDataRange, isLoading } = useCryptoHistoricoRange(cryptoId, 365);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse text-secondary">Cargando gráfico...</div>
      </div>
    );
  }

  if (!chartDataRange || !chartDataRange.data || chartDataRange.data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-secondary text-sm">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-xs text-secondary mt-1">Evolución histórica - Último año</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Variación anual</p>
          <p
            className={`text-lg font-bold tabular-nums ${chartDataRange.changePercent >= 0 ? 'text-success' : 'text-error'}`}
          >
            {chartDataRange.changePercent >= 0 ? '+' : ''}
            {chartDataRange.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
        <div className="h-96">
          <UniversalLightweightChart
            data={chartDataRange.data.map((d) => ({ date: d.fecha, value: d.valor }))}
            title={name}
            color="#f59e0b"
            formatValue={(v) => `$${v.toFixed(2)}`}
            height={384}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Format price with proper currency format and decimals
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
}

export const FavoriteCryptoRow = React.memo(function FavoriteCryptoRow({
  crypto,
  selectedDolar,
  isExpanded,
  onToggle,
  onExpand,
}: FavoriteCryptoRowProps) {
  const getTrendData = (percentage: number) => {
    // Crypto: up=bueno (verde), down=malo (rojo)
    if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
    if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
    return { icon: FaMinus, color: 'text-warning' };
  };

  const trend24h = getTrendData(crypto.price_change_percentage_24h);
  const TrendIcon = trend24h.icon;

  const handleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onExpand(`crypto-${crypto.id}`);
    },
    [onExpand, crypto.id]
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle(crypto.id);
    },
    [onToggle, crypto.id]
  );

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(`${crypto.name}: ${formatPrice(crypto.current_price)}`);
    },
    [crypto.name, crypto.current_price]
  );

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (navigator.share) {
        navigator.share({
          title: crypto.name,
          text: `${crypto.name}: ${formatPrice(crypto.current_price)}`,
        });
      }
    },
    [crypto.name, crypto.current_price]
  );

  return (
    <React.Fragment>
      <TableRow className="group hover:bg-background-secondary/30 transition-colors">
        {/* Nombre */}
        <TableCell align="left">
          <div className="flex items-center gap-2">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-8 h-8 rounded-full flex-shrink-0"
              loading="lazy"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
              <p className="text-xs text-secondary uppercase">{crypto.symbol}</p>
            </div>
          </div>
        </TableCell>

        {/* Precio USD */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatPrice(crypto.current_price)}
          </span>
        </TableCell>

        {/* Precio ARS */}
        <TableCell align="right">
          {selectedDolar ? (
            <span className="text-sm font-semibold text-brand tabular-nums">
              $
              {(crypto.current_price * selectedDolar.venta).toLocaleString('es-AR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          ) : (
            <span className="text-xs text-secondary">...</span>
          )}
        </TableCell>

        {/* Variación 24h */}
        <TableCell align="right">
          <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
            <TrendIcon className="text-xs" />
            <span className="text-sm font-bold tabular-nums">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </TableCell>

        {/* Sparkline 7D */}
        <TableCell align="center">
          <div className="flex items-center justify-center gap-2">
            {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 ? (
              <CryptoSparkline
                data={crypto.sparkline_in_7d.price}
                trend={
                  crypto.price_change_percentage_24h > 0
                    ? 'up'
                    : crypto.price_change_percentage_24h < 0
                      ? 'down'
                      : 'neutral'
                }
                isCrypto={true}
              />
            ) : (
              <span className="text-xs text-secondary">-</span>
            )}
          </div>
        </TableCell>

        {/* Acciones */}
        <TableCell align="right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleExpand}
              className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                isExpanded
                  ? 'bg-brand/10 text-brand hover:bg-brand/20'
                  : 'bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10'
              }`}
              aria-label={isExpanded ? 'Ocultar gráfico' : 'Ver gráfico'}
              title={isExpanded ? 'Ocultar gráfico' : 'Ver gráfico'}
            >
              <FaChartLine className="text-sm" />
            </button>
            <button
              onClick={handleToggle}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-brand/10 text-brand hover:bg-brand/20"
              aria-label="Quitar de favoritos"
              title="Quitar de favoritos"
            >
              <FaStar className="text-sm" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
              aria-label="Copiar"
              title="Copiar valor"
            >
              <FaCopy className="text-sm" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
              aria-label="Compartir"
              title="Compartir"
            >
              <FaShareAlt className="text-sm" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expandable chart row */}
      {isExpanded && (
        <TableRow hoverable={false}>
          <TableCell colSpan={6} className="py-6 bg-background-secondary/20">
            <ExpandedCryptoChart cryptoId={crypto.id} name={crypto.name} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
});
