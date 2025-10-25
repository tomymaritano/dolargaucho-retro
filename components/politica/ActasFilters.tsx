/**
 * ActasFilters Component
 *
 * Single Responsibility: Search and year filter inputs for actas
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaSearch } from 'react-icons/fa';
import type { Camara } from '@/hooks/useActasData';
import { getAñosDisponibles } from '@/lib/utils/actasUtils';
import type { ActaSenado, ActaDiputados } from '@/types/api/argentina';

interface ActasFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  añoSeleccionado: number | null;
  onAñoChange: (año: number | null) => void;
  todasActas: (ActaSenado | ActaDiputados)[] | undefined;
  actasFiltradas: (ActaSenado | ActaDiputados)[];
  camara: Camara;
}

export const ActasFilters = React.memo(function ActasFilters({
  searchTerm,
  onSearchChange,
  añoSeleccionado,
  onAñoChange,
  todasActas,
  actasFiltradas,
  camara,
}: ActasFiltersProps) {
  const añosDisponibles = getAñosDisponibles(todasActas || []);

  return (
    <Card variant="elevated" padding="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Buscar actas</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por tipo, periodo, orden del día..."
              className="w-full pl-10 pr-4 py-2.5 bg-panel border border-white/5 rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Filtrar por año</label>
          <select
            value={añoSeleccionado || ''}
            onChange={(e) => onAñoChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-2.5 bg-panel border border-white/5 rounded-lg text-foreground focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
          >
            <option value="">Todos los años</option>
            {añosDisponibles.map((año) => (
              <option key={año} value={año}>
                {año}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm text-secondary">
          Mostrando <span className="text-brand font-semibold">{actasFiltradas.length}</span> de{' '}
          <span className="text-foreground font-semibold">{todasActas?.length || 0}</span> actas del{' '}
          {camara === 'senado' ? 'Senado' : 'Cámara de Diputados'}
          {añoSeleccionado && ` del año ${añoSeleccionado}`}
        </p>
      </div>
    </Card>
  );
});
