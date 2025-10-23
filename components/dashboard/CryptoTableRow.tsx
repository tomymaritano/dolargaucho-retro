/**
 * CryptoTableRow Component
 *
 * Single Responsibility: Render a single cryptocurrency row with professional hover effects
 */

import React, { useCallback } from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import {
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaShareAlt,
  FaCopy,
} from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { formatPriceUSD, formatCompactNumber } from '@/lib/utils/formatters';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

interface CryptoTableRowProps {
  crypto: CryptoData;
  selectedDolar: Quotation | undefined;
  isFavorite: boolean;
  ranking: number;
  onToggleFavorite: (id: string) => void;
}

const getTrendData = (percentage: number) => {
  if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
  if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
  return { icon: FaMinus, color: 'text-warning' };
};

export const CryptoTableRow = React.memo(function CryptoTableRow({
  crypto,
  selectedDolar,
  isFavorite,
  ranking,
  onToggleFavorite,
}: CryptoTableRowProps) {
  const trend24h = getTrendData(crypto.price_change_percentage_24h);
  const trend7d = getTrendData(crypto.price_change_percentage_7d_in_currency || 0);
  const TrendIcon24h = trend24h.icon;
  const TrendIcon7d = trend7d.icon;

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(crypto.id);
  }, [onToggleFavorite, crypto.id]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(`${crypto.name}: ${formatPriceUSD(crypto.current_price)}`);
  }, [crypto.name, crypto.current_price]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: crypto.name,
        text: `${crypto.name}: ${formatPriceUSD(crypto.current_price)}`,
      });
    }
  }, [crypto.name, crypto.current_price]);

  return (
    <React.Fragment>
      <TableRow className="group">
        {/* Nombre con badge de favorito */}
        <TableCell align="left">
          <div className="flex items-center gap-2">
            {isFavorite && <FaStar className="text-brand text-xs flex-shrink-0 animate-pulse" />}
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-8 h-8 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors duration-300">
                {crypto.name}
              </p>
              <p className="text-xs text-secondary uppercase">{crypto.symbol}</p>
            </div>
          </div>
        </TableCell>

        {/* Precio USD */}
        <TableCell align="right">
          <span className="text-sm font-semibold text-foreground tabular-nums group-hover:scale-105 inline-block transition-transform duration-300">
            {formatPriceUSD(crypto.current_price)}
          </span>
        </TableCell>

        {/* Precio ARS */}
        <TableCell align="right">
          {selectedDolar ? (
            <span className="text-sm font-semibold text-brand tabular-nums group-hover:scale-105 inline-block transition-transform duration-300">
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
          <div
            className={`inline-flex items-center gap-1 ${trend24h.color} group-hover:scale-110 transition-transform duration-300`}
          >
            <TrendIcon24h className="text-xs" />
            <span className="text-sm font-bold tabular-nums">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </TableCell>

        {/* 7d % */}
        <TableCell align="right">
          <div
            className={`inline-flex items-center gap-1 ${trend7d.color} group-hover:scale-110 transition-transform duration-300`}
          >
            <TrendIcon7d className="text-xs" />
            <span className="text-sm font-bold tabular-nums">
              {(crypto.price_change_percentage_7d_in_currency || 0) > 0 ? '+' : ''}
              {(crypto.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
            </span>
          </div>
        </TableCell>

        {/* 7D Trend Sparkline */}
        <TableCell align="center">
          {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 ? (
            <div className="group-hover:scale-105 transition-transform duration-300">
              <CryptoSparkline
                data={crypto.sparkline_in_7d.price}
                trend={
                  (crypto.price_change_percentage_7d_in_currency || 0) > 0
                    ? 'up'
                    : (crypto.price_change_percentage_7d_in_currency || 0) < 0
                      ? 'down'
                      : 'neutral'
                }
                isCrypto={true}
              />
            </div>
          ) : (
            <span className="text-xs text-secondary">-</span>
          )}
        </TableCell>

        {/* Acciones - Always visible, more prominent on hover */}
        <TableCell align="center">
          <div className="flex items-center justify-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                isFavorite ? 'text-brand bg-brand/10' : 'text-secondary hover:text-brand'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFavorite ? <FaStar className="text-xs" /> : <FaRegStar className="text-xs" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 text-secondary hover:text-brand"
              aria-label="Copiar"
              title="Copiar valor"
            >
              <FaCopy className="text-xs" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 text-secondary hover:text-brand"
              aria-label="Compartir"
              title="Compartir"
            >
              <FaShareAlt className="text-xs" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expandable Row with professional slide-down animation */}
      <TableRow
        hoverable={false}
        className="hidden group-hover:table-row animate-in slide-in-from-top-2 duration-300"
      >
        <TableCell colSpan={7} className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">Ranking</p>
              <p className="font-semibold text-foreground text-xs">#{ranking}</p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">Market Cap</p>
              <p className="font-semibold text-foreground text-xs">
                {formatCompactNumber(crypto.market_cap)}
              </p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">24h High</p>
              <p className="font-semibold text-success text-xs">
                {formatPriceUSD(crypto.high_24h)}
              </p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
              <p className="font-semibold text-error text-xs">{formatPriceUSD(crypto.low_24h)}</p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">Volumen 24h</p>
              <p className="font-semibold text-foreground text-xs">
                {formatCompactNumber(crypto.total_volume)}
              </p>
            </div>
            <div className="group/stat hover:scale-105 transition-transform duration-200">
              <p className="text-secondary text-[10px] mb-0.5">Suministro</p>
              <p className="font-semibold text-foreground text-xs">
                {formatCompactNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
              </p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
});
