/**
 * FavoriteRowCrypto Component
 *
 * Single Responsibility: Render a single crypto row in favorites table with expandable details
 */

import React from 'react';
import { TableRow, TableCell } from '@/components/ui/Table';
import { FaStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { FavoriteActionsBar } from './FavoriteActionsBar';
import { formatPriceUSD, formatCompactNumber } from '@/lib/utils/formatters';
import type { CryptoData } from '@/types/api/crypto';
import type { Quotation } from '@/types/api/dolar';

interface FavoriteRowCryptoProps {
  crypto: CryptoData;
  selectedDolar: Quotation | undefined;
  onToggleFavorite: () => void;
}

export function FavoriteRowCrypto({
  crypto,
  selectedDolar,
  onToggleFavorite,
}: FavoriteRowCryptoProps) {
  const getTrendData = (percentage: number) => {
    // Crypto: up=bueno (verde), down=malo (rojo)
    if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
    if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
    return { icon: FaMinus, color: 'text-warning' };
  };

  const trend24h = getTrendData(crypto.price_change_percentage_24h);
  const TrendIcon = trend24h.icon;

  const handleCopy = () => {
    const price = formatPriceUSD(crypto.current_price);
    navigator.clipboard.writeText(`${crypto.name}: ${price}`);
  };

  return (
    <React.Fragment>
      <TableRow className="group">
        {/* Nombre con badge de favorito */}
        <TableCell align="left">
          <div className="flex items-center gap-2">
            <FaStar className="text-brand text-xs flex-shrink-0" />
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

        <TableCell align="right">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatPriceUSD(crypto.current_price)}
          </span>
        </TableCell>

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

        <TableCell align="right">
          <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
            <TrendIcon className="text-xs" />
            <span className="text-sm font-bold tabular-nums">
              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </TableCell>

        <TableCell align="center" className="relative">
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

          {/* Gradient lateral con acciones - aparece en hover */}
          <FavoriteActionsBar
            onToggleFavorite={onToggleFavorite}
            onCopy={handleCopy}
            itemName={crypto.name}
            itemValue={formatPriceUSD(crypto.current_price)}
          />
        </TableCell>
      </TableRow>

      {/* Expandable Row */}
      <TableRow hoverable={false} className="hidden group-hover:table-row bg-brand/5">
        <TableCell colSpan={5} className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div>
              <p className="text-secondary text-[10px] mb-0.5">Market Cap</p>
              <p className="font-semibold text-foreground text-xs">
                {formatCompactNumber(crypto.market_cap)}
              </p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">24h High</p>
              <p className="font-semibold text-success text-xs">
                {formatPriceUSD(crypto.high_24h)}
              </p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
              <p className="font-semibold text-error text-xs">{formatPriceUSD(crypto.low_24h)}</p>
            </div>
            <div>
              <p className="text-secondary text-[10px] mb-0.5">Volumen 24h</p>
              <p className="font-semibold text-foreground text-xs">
                {formatCompactNumber(crypto.total_volume)}
              </p>
            </div>
            <div>
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
}
