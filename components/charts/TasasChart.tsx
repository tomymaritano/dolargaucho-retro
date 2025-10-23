import React from 'react';
import { useTasaPlazoFijo } from '@/hooks/useFinanzas';
import { Card } from '@/components/ui/Card/Card';
import { FaSpinner } from 'react-icons/fa';

interface TasasChartProps {
  limit?: number;
  // Favorite props (optional)
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const TasasChart = React.memo(function TasasChart({
  limit = 10,
  isFavorite,
  onToggleFavorite,
}: TasasChartProps) {
  const { data: tasas, isLoading } = useTasaPlazoFijo();

  const chartData = React.useMemo(() => {
    if (!tasas) return [];

    // Ordenar por TNA de clientes (descendente) y tomar los primeros N
    return tasas
      .filter((t) => t.tnaClientes !== null)
      .sort((a, b) => (b.tnaClientes || 0) - (a.tnaClientes || 0))
      .slice(0, limit)
      .map((tasa) => ({
        entidad: tasa.entidad.split(' ').slice(0, 3).join(' '), // Acortar nombre
        tnaClientes: tasa.tnaClientes ? (tasa.tnaClientes * 100).toFixed(2) : 0,
        tnaNoClientes: tasa.tnaNoClientes ? (tasa.tnaNoClientes * 100).toFixed(2) : 0,
      }));
  }, [tasas, limit]);

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center h-80">
          <FaSpinner className="animate-spin text-4xl text-brand" />
        </div>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center h-80 text-secondary">
          No hay datos disponibles
        </div>
      </Card>
    );
  }

  const maxTasa = Math.max(...chartData.map((d) => parseFloat(d.tnaClientes as string)));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Mejores Tasas de Plazo Fijo</h3>
        <p className="text-xs text-secondary">Top {limit} bancos • TNA para clientes</p>
      </div>

      {/* Visual Table */}
      <div className="space-y-2">
        {chartData.map((tasa, index) => {
          const tasaClientes = parseFloat(tasa.tnaClientes as string);
          const tasaNoClientes = parseFloat(tasa.tnaNoClientes as string);
          const percentage = (tasaClientes / maxTasa) * 100;
          const isBest = index === 0;

          return (
            <div
              key={index}
              className={`group relative p-3 rounded-lg hover:bg-white/[0.02] transition-all ${
                isBest ? 'bg-green-500/5 border border-green-500/20' : ''
              }`}
            >
              {/* Podio badge para top 3 */}
              {index < 3 && (
                <div
                  className={`absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    index === 0
                      ? 'bg-yellow-500 text-black'
                      : index === 1
                        ? 'bg-gray-400 text-black'
                        : 'bg-orange-600 text-white'
                  }`}
                >
                  {index + 1}
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                {/* Banco */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate pr-4">
                    {tasa.entidad}
                  </div>
                </div>

                {/* Tasas */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-secondary">Clientes</div>
                    <div
                      className={`text-lg font-black ${isBest ? 'text-green-400' : 'text-brand'}`}
                    >
                      {tasa.tnaClientes}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-secondary">No Clientes</div>
                    <div className="text-lg font-bold text-purple-400">{tasa.tnaNoClientes}%</div>
                  </div>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isBest
                      ? 'bg-gradient-to-r from-green-500 to-green-400'
                      : 'bg-gradient-to-r from-brand to-brand/50'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
