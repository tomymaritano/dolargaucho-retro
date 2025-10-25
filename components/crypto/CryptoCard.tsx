'use client';

import React, { useState } from 'react';
import {
  FaStar,
  FaRegStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaCopy,
  FaCheckCircle,
  FaShareAlt,
} from 'react-icons/fa';
import { Card } from '@/components/ui/Card/Card';
import type { CryptoData } from '@/types/api/crypto';
import { logger } from '@/lib/utils/logger';
import {
  formatPrice,
  formatPriceARS,
  formatCompactNumber,
  formatPercentage,
} from '@/lib/utils/formatters';

interface CryptoCardProps {
  crypto: CryptoData;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  priceInArs?: number;
}

export const CryptoCard = React.memo(function CryptoCard({
  crypto,
  isFavorite,
  onToggleFavorite,
  priceInArs,
}: CryptoCardProps) {
  const [copied, setCopied] = useState(false);

  const getTrendData = (percentage: number) => {
    if (percentage > 0) {
      return {
        icon: FaArrowUp,
        color: 'text-success',
        bg: 'bg-success/10',
        label: 'Subió',
      };
    }
    if (percentage < 0) {
      return {
        icon: FaArrowDown,
        color: 'text-error',
        bg: 'bg-error/10',
        label: 'Bajó',
      };
    }
    return {
      icon: FaMinus,
      color: 'text-warning',
      bg: 'bg-warning/10',
      label: 'Estable',
    };
  };

  const trend24h = getTrendData(crypto.price_change_percentage_24h);
  const trend7d = crypto.price_change_percentage_7d_in_currency
    ? getTrendData(crypto.price_change_percentage_7d_in_currency)
    : null;

  const handleCopy = async () => {
    try {
      const text = `${crypto.name} (${crypto.symbol.toUpperCase()}): ${formatPrice(crypto.current_price)} USD | Cambio 24h: ${formatPercentage(crypto.price_change_percentage_24h, 2, true)}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error('Error al copiar crypto', error, { component: 'CryptoCard', crypto: crypto.id });
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${crypto.name} (${crypto.symbol.toUpperCase()})`,
          text: `Precio actual: ${formatPrice(crypto.current_price)} USD\nCambio 24h: ${formatPercentage(crypto.price_change_percentage_24h, 2, true)}`,
          url: window.location.href,
        });
      } catch (error) {
        logger.error('Error al compartir crypto', error, {
          component: 'CryptoCard',
          crypto: crypto.id,
        });
      }
    }
  };

  return (
    <Card variant="elevated" padding="lg" hover="glow">
      {/* Header: Logo + Name + Favorite */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-10 h-10 rounded-full"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground truncate">{crypto.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-secondary uppercase font-semibold">
                {crypto.symbol.toUpperCase()}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] glass rounded text-secondary">
                #{crypto.market_cap_rank}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(crypto.id)}
          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
            isFavorite
              ? 'bg-brand/20 text-brand'
              : 'glass text-secondary hover:text-brand hover:bg-panel/10'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
        </button>
      </div>

      {/* Main Price + 24h Change */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-secondary">Precio USD</p>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trend24h.bg} ${trend24h.color}`}
          >
            <trend24h.icon className="text-[10px]" />
            <span className="text-[10px] font-bold tabular-nums">
              {formatPercentage(Math.abs(crypto.price_change_percentage_24h), 2)}
            </span>
          </div>
        </div>
        <p className="text-3xl font-bold text-brand tabular-nums mb-1">
          {formatPrice(crypto.current_price)}
        </p>
        {priceInArs && priceInArs > 0 && (
          <p className="text-sm text-secondary tabular-nums">≈ {formatPriceARS(priceInArs)} ARS</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-panel/50 border border-border/5">
          <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Market Cap</p>
          <p className="text-sm font-bold text-foreground tabular-nums">
            {formatCompactNumber(crypto.market_cap)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-panel/50 border border-border/5">
          <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">Volumen 24h</p>
          <p className="text-sm font-bold text-foreground tabular-nums">
            {formatCompactNumber(crypto.total_volume)}
          </p>
        </div>
      </div>

      {/* Additional Changes */}
      {trend7d && (
        <div className="mb-4 p-2.5 rounded-lg glass border border-border/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary">Cambio 7 días</span>
            <div className={`flex items-center gap-1 ${trend7d.color}`}>
              <trend7d.icon className="text-[10px]" />
              <span className="text-xs font-bold tabular-nums">
                {formatPercentage(Math.abs(crypto.price_change_percentage_7d_in_currency || 0), 2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border/10">
        <button
          onClick={handleCopy}
          className="flex-1 px-3 py-2 rounded-lg glass hover:bg-brand/10 transition-all text-secondary hover:text-brand flex items-center justify-center gap-2 text-xs font-medium"
          title="Copiar información"
        >
          {copied ? (
            <>
              <FaCheckCircle className="text-brand" />
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
            onClick={handleShare}
            className="px-3 py-2 rounded-lg glass hover:bg-brand/10 transition-all text-secondary hover:text-brand"
            title="Compartir"
          >
            <FaShareAlt className="text-sm" />
          </button>
        )}
      </div>
    </Card>
  );
});
