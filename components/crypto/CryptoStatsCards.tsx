import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaBitcoin, FaStar } from 'react-icons/fa';

interface CryptoStatsCardsProps {
  totalCryptos: number;
  favoriteCount: number;
}

export function CryptoStatsCards({ totalCryptos, favoriteCount }: CryptoStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary uppercase tracking-wider mb-1">Total Cryptos</p>
            <p className="text-2xl font-bold text-foreground">{totalCryptos}</p>
          </div>
          <div className="p-3 rounded-xl glass">
            <FaBitcoin className="text-brand text-2xl" />
          </div>
        </div>
      </Card>

      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary uppercase tracking-wider mb-1">Favoritos</p>
            <p className="text-2xl font-bold text-foreground">{favoriteCount}</p>
          </div>
          <div className="p-3 rounded-xl glass">
            <FaStar className="text-brand text-2xl" />
          </div>
        </div>
      </Card>

      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary uppercase tracking-wider mb-1">Actualización</p>
            <p className="text-sm font-semibold text-brand">Cada 5min</p>
          </div>
          <div className="p-3 rounded-xl glass">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
