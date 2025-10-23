/**
 * ActasStatsCards Component
 *
 * Single Responsibility: Display statistics cards for actas
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaFileAlt, FaCalendarAlt } from 'react-icons/fa';

interface ActasStatsCardsProps {
  total: number;
  ordinarias: number;
  extraordinarias: number;
}

export const ActasStatsCards = React.memo(function ActasStatsCards({
  total,
  ordinarias,
  extraordinarias,
}: ActasStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card variant="elevated" padding="md">
        <div className="text-center">
          <FaFileAlt className="text-brand text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{total}</div>
          <div className="text-xs text-secondary mt-1">Total</div>
        </div>
      </Card>

      <Card variant="elevated" padding="md">
        <div className="text-center">
          <FaCalendarAlt className="text-brand text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{ordinarias}</div>
          <div className="text-xs text-secondary mt-1">Ordinarias</div>
        </div>
      </Card>

      <Card variant="elevated" padding="md">
        <div className="text-center">
          <FaCalendarAlt className="text-brand-light text-2xl mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{extraordinarias}</div>
          <div className="text-xs text-secondary mt-1">Extraordinarias</div>
        </div>
      </Card>
    </div>
  );
});
