import React, { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import { FaStar, FaArrowUp, FaArrowDown, FaMinus, FaChartLine } from 'react-icons/fa';
import { UniversalLightweightChart } from '@/components/charts/UniversalLightweightChart';
import { useDolarHistoricoRange } from '@/hooks/useDolarHistoricoRange';
import type { DolarHistoricoDataPoint } from '@/hooks/useDolarHistoricoRange';

interface Dolar {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  variation: {
    trend: 'up' | 'down' | 'neutral';
    percentage: number;
  };
}

interface FavoriteDolaresTableProps {
  /** Array of favorite dolar data */
  dolares: Dolar[];
  /** Callback when user toggles favorite status */
  onToggleFavorite: (casa: string) => void;
}

/**
 * Expanded chart component for a specific dollar
 */
function ExpandedDolarChart({ casa, nombre }: { casa: string; nombre: string }) {
  const { data: chartDataRange, isLoading } = useDolarHistoricoRange(casa, 365);

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
          <h3 className="text-lg font-bold text-foreground">{nombre}</h3>
          <p className="text-xs text-secondary mt-1">Evolución histórica - Último año</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Variación anual</p>
          <p
            className={`text-lg font-bold tabular-nums ${chartDataRange.changePercent >= 0 ? 'text-error' : 'text-success'}`}
          >
            {chartDataRange.changePercent >= 0 ? '+' : ''}
            {chartDataRange.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-background-secondary/30">
        <div className="h-96">
          <UniversalLightweightChart
            data={chartDataRange.data.map((d: DolarHistoricoDataPoint) => ({
              date: d.fecha,
              value: d.valor,
            }))}
            title={nombre}
            color="#3b82f6"
            formatValue={(v) => `$${v.toFixed(2)}`}
            height={384}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * FavoriteDolaresTable Component
 *
 * Displays a table of user's favorite dollar rates with the ability to remove them.
 * Shows buy/sell prices and variation trends.
 *
 * @component
 * @example
 * <FavoriteDolaresTable
 *   dolares={favoriteDolares}
 *   onToggleFavorite={handleToggle}
 * />
 */
export const FavoriteDolaresTable = React.memo(function FavoriteDolaresTable({
  dolares,
  onToggleFavorite,
}: FavoriteDolaresTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!dolares || dolares.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated" padding="none">
      <div className="p-6 border-b border-border/10">
        <h2 className="text-xl font-bold text-foreground">Dólares Favoritos</h2>
        <p className="text-sm text-secondary mt-1">
          {dolares.length} {dolares.length === 1 ? 'favorito' : 'favoritos'}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHeaderCell align="center" width="48px">
              <FaStar className="inline-block text-brand" />
            </TableHeaderCell>
            <TableHeaderCell align="left">Tipo</TableHeaderCell>
            <TableHeaderCell align="right">Compra</TableHeaderCell>
            <TableHeaderCell align="right">Venta</TableHeaderCell>
            <TableHeaderCell align="right">Variación</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dolares.map((dolar) => {
            const { trend, percentage } = dolar.variation;
            const TrendIcon = trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
            const trendColor =
              trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-warning';
            const isExpanded = expandedRow === dolar.casa;

            return (
              <React.Fragment key={dolar.casa}>
                <TableRow>
                  <TableCell align="center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : dolar.casa)}
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
                        onClick={() => onToggleFavorite(dolar.casa)}
                        className="p-2 rounded-lg text-brand bg-brand/10 hover:bg-brand/20 transition-all hover:scale-110 active:scale-95"
                        aria-label={`Quitar ${dolar.nombre} de favoritos`}
                      >
                        <FaStar className="text-sm" />
                      </button>
                    </div>
                  </TableCell>

                  <TableCell align="left">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{dolar.nombre}</p>
                      <p className="text-xs text-secondary">{dolar.casa}</p>
                    </div>
                  </TableCell>

                  <TableCell align="right">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      ${dolar.compra.toFixed(2)}
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    <span className="text-sm font-semibold text-brand tabular-nums">
                      ${dolar.venta.toFixed(2)}
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                      <TrendIcon className="text-xs" />
                      <span className="text-sm font-bold tabular-nums">
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expandable chart row */}
                {isExpanded && (
                  <TableRow hoverable={false}>
                    <TableCell colSpan={5} className="py-6 bg-background-secondary/20">
                      <ExpandedDolarChart casa={dolar.casa} nombre={dolar.nombre} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
});
