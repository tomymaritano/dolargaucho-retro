import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { useActasDiputados, useActasDiputadosByYear } from '@/hooks/usePolitica';
import { FaFileAlt, FaExternalLinkAlt, FaSearch, FaCalendarAlt, FaSpinner } from 'react-icons/fa';

interface ActasDiputadosProps {
  limit?: number;
}

export const ActasDiputados = React.memo(function ActasDiputados({
  limit = 50,
}: ActasDiputadosProps) {
  const currentYear = new Date().getFullYear();
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: todasActas, isLoading: loadingTodas } = useActasDiputados();
  const { data: actasPorAño, isLoading: loadingPorAño } = useActasDiputadosByYear(
    añoSeleccionado || currentYear
  );

  const isLoading = loadingTodas || loadingPorAño;
  const actas = añoSeleccionado ? actasPorAño : todasActas;

  // Obtener años disponibles
  const añosDisponibles = useMemo(() => {
    if (!todasActas) return [];
    const años = new Set(todasActas.map((acta) => new Date(acta.fecha).getFullYear()));
    return Array.from(años).sort((a, b) => b - a);
  }, [todasActas]);

  // Filtrar actas por búsqueda
  const actasFiltradas = useMemo(() => {
    if (!actas) return [];

    let filtered = actas;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (acta) =>
          acta.tipo?.toLowerCase().includes(term) ||
          acta.periodo?.toLowerCase().includes(term) ||
          acta.numero_reunion?.toString().includes(term)
      );
    }

    return filtered.slice(0, limit);
  }, [actas, searchTerm, limit]);

  // Estadísticas
  const stats = useMemo(() => {
    if (!actas) return { total: 0, ordinarias: 0, extraordinarias: 0 };

    return {
      total: actas.length,
      ordinarias: actas.filter((a) => a.tipo?.toLowerCase().includes('ordinaria')).length,
      extraordinarias: actas.filter((a) => a.tipo?.toLowerCase().includes('extraordinaria')).length,
    };
  }, [actas]);

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-brand mx-auto mb-4" />
          <p className="text-secondary">Cargando actas de Diputados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated" padding="md" hover="glow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary text-xs uppercase tracking-wider mb-1">
                Total Actas
              </div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaFileAlt className="text-brand text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md" hover="glow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary text-xs uppercase tracking-wider mb-1">Ordinarias</div>
              <div className="text-2xl font-bold text-white">{stats.ordinarias}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaCalendarAlt className="text-brand text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md" hover="glow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary text-xs uppercase tracking-wider mb-1">
                Extraordinarias
              </div>
              <div className="text-2xl font-bold text-white">{stats.extraordinarias}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaCalendarAlt className="text-brand-light text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm text-secondary mb-2">Buscar actas</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por tipo, asunto o número..."
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-secondary/50 focus:ring-2 focus:ring-brand/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm text-secondary mb-2">Filtrar por año</label>
            <select
              value={añoSeleccionado || ''}
              onChange={(e) => setAñoSeleccionado(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-brand/50 focus:outline-none"
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
      </Card>

      {/* Actas List */}
      <Card variant="elevated" padding="lg">
        <Card.Header>
          <Card.Title>
            Actas de la Cámara de Diputados
            {añoSeleccionado && ` - ${añoSeleccionado}`}
          </Card.Title>
          <p className="text-sm text-secondary mt-1">
            {actasFiltradas.length} acta{actasFiltradas.length !== 1 ? 's' : ''} encontrada
            {actasFiltradas.length !== 1 ? 's' : ''}
          </p>
        </Card.Header>

        <Card.Content>
          {actasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-4xl text-secondary mx-auto mb-3" />
              <p className="text-secondary">No se encontraron actas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actasFiltradas.map((acta, index) => (
                <div
                  key={`${acta.fecha}-${index}`}
                  className="p-4 glass border border-border rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${
                            acta.tipo?.toLowerCase().includes('ordinaria')
                              ? 'bg-brand/20 text-brand'
                              : 'bg-brand-light/20 text-brand-light'
                          }`}
                        >
                          {acta.tipo || 'Sin tipo'}
                        </span>
                        {acta.numero_reunion && (
                          <span className="text-xs text-secondary">Nº {acta.numero_reunion}</span>
                        )}
                      </div>

                      <h4 className="text-white font-semibold mb-1">
                        {acta.orden_dia || 'Sesión de Diputados'}
                      </h4>

                      <div className="flex items-center gap-4 text-sm text-secondary">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt />
                          <span>{formatearFecha(acta.fecha)}</span>
                        </div>
                      </div>
                    </div>

                    {acta.url_pdf && (
                      <a
                        href={acta.url_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-brand/20 text-brand rounded-lg hover:bg-brand/30 transition-colors"
                      >
                        <FaFileAlt />
                        <span className="text-sm font-semibold">Ver PDF</span>
                        <FaExternalLinkAlt className="text-xs" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>

        {actasFiltradas.length >= limit && (
          <Card.Footer>
            <p className="text-center text-sm text-secondary">
              Mostrando las primeras {limit} actas. Usa los filtros para refinar la búsqueda.
            </p>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
});
