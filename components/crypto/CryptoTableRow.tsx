/**
 * CryptoTableRow Component
 *
 * Unified design matching DolaresTable structure:
 * - Logo + Name
 * - Precio USD
 * - Precio ARS
 * - 24h %
 * - 30d %
 * - 30D Trend Sparkline
 * - Acciones (Favorito, Copy, Share)
 */

import React from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import {
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaCopy,
  FaShareAlt,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import type { CryptoData } from '@/types/api/crypto';
import type { DolarQuotation } from '@/types/api/dolar';

interface CryptoTableRowProps {
  crypto: CryptoData;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  selectedDolar: DolarQuotation | null | undefined;
}

export function CryptoTableRow({
  crypto,
  index,
  isFavorite,
  onToggleFavorite,
  selectedDolar,
}: CryptoTableRowProps) {
  const getTrendData = (percentage: number) => {
    if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
    if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
    return { icon: FaMinus, color: 'text-warning' };
  };

  const trend24h = getTrendData(crypto.price_change_percentage_24h);
  const TrendIcon = trend24h.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    return `$${(value / 1_000_000).toFixed(2)}M`;
  };

  return (
    <React.Fragment>
      <TableRow className="group hover:bg-background-secondary/30 transition-colors">
        {/* Logo + Nombre */}
        <TableCell>
          <div className="flex items-center gap-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
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
            <span className="text-sm font-bold text-brand tabular-nums">
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

        {/* 24h % */}
        <TableCell align="right">
          <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
            <TrendIcon className="text-xs" />
            <span className="text-sm font-bold tabular-nums">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </TableCell>

        {/* Market Cap */}
        <TableCell align="right">
          <span className="text-sm text-foreground tabular-nums">
            {formatMarketCap(crypto.market_cap)}
          </span>
        </TableCell>

        {/* 30d % */}
        <TableCell align="right">
          {crypto.price_change_percentage_30d_in_currency !== undefined ? (
            <div
              className={`inline-flex items-center gap-1 ${
                crypto.price_change_percentage_30d_in_currency > 0
                  ? 'text-success'
                  : crypto.price_change_percentage_30d_in_currency < 0
                    ? 'text-error'
                    : 'text-warning'
              }`}
            >
              {crypto.price_change_percentage_30d_in_currency > 0 ? (
                <FaArrowUp className="text-xs" />
              ) : crypto.price_change_percentage_30d_in_currency < 0 ? (
                <FaArrowDown className="text-xs" />
              ) : (
                <FaMinus className="text-xs" />
              )}
              <span className="text-sm font-bold tabular-nums">
                {crypto.price_change_percentage_30d_in_currency > 0 ? '+' : ''}
                {crypto.price_change_percentage_30d_in_currency.toFixed(2)}%
              </span>
            </div>
          ) : (
            <span className="text-xs text-secondary">-</span>
          )}
        </TableCell>

        {/* 30D Trend Sparkline */}
        <TableCell align="center">
          <div className="flex items-center justify-center">
            {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 ? (
              <CryptoSparkline
                data={crypto.sparkline_in_7d.price}
                trend={
                  crypto.price_change_percentage_30d_in_currency &&
                  crypto.price_change_percentage_30d_in_currency > 0
                    ? 'up'
                    : crypto.price_change_percentage_30d_in_currency &&
                        crypto.price_change_percentage_30d_in_currency < 0
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

        {/* Acciones - matching DolaresTable style */}
        <TableCell align="right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                isFavorite
                  ? 'bg-brand/10 text-brand hover:bg-brand/20'
                  : 'bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${crypto.name}: ${formatPrice(crypto.current_price)}`
                );
              }}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
              aria-label="Copiar"
              title="Copiar valor"
            >
              <FaCopy className="text-sm" />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: crypto.name,
                    text: `${crypto.name}: ${formatPrice(crypto.current_price)}`,
                  });
                }
              }}
              className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95 bg-panel-hover text-foreground/70 hover:text-brand hover:bg-brand/10"
              aria-label="Compartir"
              title="Compartir"
            >
              <FaShareAlt className="text-sm" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expandable row on hover - matching DolaresTable */}
      <TableRow hoverable={false} className="hidden group-hover:table-row">
        <TableCell colSpan={8} className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-secondary text-[10px] mb-0.5">Ranking</p>
              <p className="font-semibold text-foreground text-xs">#{index + 1}</p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">24h High</p>
              <p className="font-semibold text-success text-xs">{formatPrice(crypto.high_24h)}</p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
              <p className="font-semibold text-error text-xs">{formatPrice(crypto.low_24h)}</p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">Volumen 24h</p>
              <p className="font-semibold text-foreground text-xs">
                {formatMarketCap(crypto.total_volume)}
              </p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
