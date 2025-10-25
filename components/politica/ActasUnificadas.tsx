'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/Card/Card';
import {
  useActasSenado,
  useActasSenadoByYear,
  useActasDiputados,
  useActasDiputadosByYear,
} from '@/hooks/usePolitica';
import {
  FaFileAlt,
  FaExternalLinkAlt,
  FaSearch,
  FaCalendarAlt,
  FaSpinner,
  FaLandmark,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import type { ActaSenado, ActaDiputados } from '@/types/api/argentina';

type Camara = 'senado' | 'diputados';

interface ActasUnificadasProps {
  limit?: number;
}

export const ActasUnificadas = React.memo(function ActasUnificadas({
  limit = 50,
}: ActasUnificadasProps) {
  const currentYear = new Date().getFullYear();
  const [camara, setCamara] = useState<Camara>('senado');
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActa, setExpandedActa] = useState<number | null>(null);

  // Fetch data based on selected chamber
  const { data: todasActasSenado, isLoading: loadingSenado } = useActasSenado();
  const { data: actasSenadoPorAño, isLoading: loadingSenadoAño } = useActasSenadoByYear(
    añoSeleccionado || currentYear
  );
  const { data: todasActasDiputados, isLoading: loadingDiputados } = useActasDiputados();
  const { data: actasDiputadosPorAño, isLoading: loadingDiputadosAño } = useActasDiputadosByYear(
    añoSeleccionado || currentYear
  );

  const isLoading =
    camara === 'senado'
      ? loadingSenado || loadingSenadoAño
      : loadingDiputados || loadingDiputadosAño;

  const actas =
    camara === 'senado'
      ? añoSeleccionado
        ? actasSenadoPorAño
        : todasActasSenado
      : añoSeleccionado
        ? actasDiputadosPorAño
        : todasActasDiputados;

  // Get available years
  const añosDisponibles = useMemo(() => {
    const todasActas = camara === 'senado' ? todasActasSenado : todasActasDiputados;
    if (!todasActas) return [];
    const años = new Set(todasActas.map((acta) => new Date(acta.fecha).getFullYear()));
    return Array.from(años).sort((a, b) => b - a);
  }, [todasActasSenado, todasActasDiputados, camara]);

  // Categorize actas based on available data
  const categorizarActa = (acta: ActaSenado | ActaDiputados) => {
    if (!acta.tipo) {
      // Fallback: try to categorize by periodo
      if (acta.periodo?.toLowerCase().includes('extraordinaria')) return 'Extraordinaria';
      if (acta.periodo?.toLowerCase().includes('ordinaria')) return 'Ordinaria';
      return 'Sesión';
    }

    const tipo = acta.tipo.toLowerCase();
    if (tipo.includes('extraordinaria')) return 'Extraordinaria';
    if (tipo.includes('ordinaria')) return 'Ordinaria';
    if (tipo.includes('preparatoria')) return 'Preparatoria';
    if (tipo.includes('especial')) return 'Especial';
    return acta.tipo || 'Sesión';
  };

  // Filter actas
  const actasFiltradas = useMemo(() => {
    if (!actas) return [];

    let filtered = actas;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (acta) =>
          categorizarActa(acta).toLowerCase().includes(term) ||
          acta.periodo?.toLowerCase().includes(term) ||
          acta.orden_dia?.toLowerCase().includes(term) ||
          acta.numero_reunion?.toString().includes(term) ||
          new Date(acta.fecha).getFullYear().toString().includes(term)
      );
    }

    // Sort by date descending
    return filtered
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, limit);
  }, [actas, searchTerm, limit]);

  // Statistics
  const stats = useMemo(() => {
    if (!actas) return { total: 0, ordinarias: 0, extraordinarias: 0 };

    const categorized = actas.map(categorizarActa);
    return {
      total: actas.length,
      ordinarias: categorized.filter((c) => c === 'Ordinaria').length,
      extraordinarias: categorized.filter((c) => c === 'Extraordinaria').length,
    };
  }, [actas]);

  // Event handlers
  const handleSelectSenado = useCallback(() => {
    setCamara('senado');
    setAñoSeleccionado(null);
    setSearchTerm('');
  }, []);

  const handleSelectDiputados = useCallback(() => {
    setCamara('diputados');
    setAñoSeleccionado(null);
    setSearchTerm('');
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAñoSeleccionado(e.target.value ? Number(e.target.value) : null);
  }, []);

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleToggleExpand = useCallback((actaId: number) => {
    setExpandedActa((prev) => (prev === actaId ? null : actaId));
  }, []);

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Ordinaria':
        return 'bg-brand/20 text-brand border-brand/30';
      case 'Extraordinaria':
        return 'bg-brand-light/20 text-brand-light border-brand-light/30';
      case 'Preparatoria':
        return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
      case 'Especial':
        return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
      default:
        return 'bg-secondary/20 text-secondary border-secondary/30';
    }
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-brand mx-auto mb-4" />
            <p className="text-secondary">Cargando actas...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with chamber selector */}
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
              <FaFileAlt className="text-brand" />
              Actas del Congreso
            </h2>
            <p className="text-sm text-secondary">
              Consulta las actas de las sesiones del Senado y la Cámara de Diputados
            </p>
          </div>

          {/* Chamber toggle */}
          <div className="flex gap-2 p-1 bg-panel rounded-lg border border-border/5">
            <button
              onClick={handleSelectSenado}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                camara === 'senado'
                  ? 'bg-brand text-background shadow-lg'
                  : 'text-foreground hover:bg-panel/10'
              }`}
            >
              <FaLandmark />
              <span>Senado</span>
            </button>
            <button
              onClick={handleSelectDiputados}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                camara === 'diputados'
                  ? 'bg-brand text-background shadow-lg'
                  : 'text-foreground hover:bg-panel/10'
              }`}
            >
              <FaUsers />
              <span>Diputados</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card variant="elevated" padding="md">
          <div className="text-center">
            <FaFileAlt className="text-brand text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-xs text-secondary mt-1">Total</div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="text-center">
            <FaCalendarAlt className="text-brand text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats.ordinarias}</div>
            <div className="text-xs text-secondary mt-1">Ordinarias</div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="text-center">
            <FaCalendarAlt className="text-brand-light text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats.extraordinarias}</div>
            <div className="text-xs text-secondary mt-1">Extraordinarias</div>
          </div>
        </Card>
      </div>

      {/* Unified Filters */}
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
                onChange={handleSearchChange}
                placeholder="Buscar por tipo, periodo, orden del día..."
                className="w-full pl-10 pr-4 py-2.5 bg-panel border border-border/5 rounded-lg text-foreground placeholder-secondary focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Filtrar por año
            </label>
            <select
              value={añoSeleccionado || ''}
              onChange={handleYearChange}
              className="w-full px-4 py-2.5 bg-panel border border-border/5 rounded-lg text-foreground focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
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
        <div className="mt-4 pt-4 border-t border-border/10">
          <p className="text-sm text-secondary">
            Mostrando <span className="text-brand font-semibold">{actasFiltradas.length}</span> de{' '}
            <span className="text-foreground font-semibold">{actas?.length || 0}</span> actas del{' '}
            {camara === 'senado' ? 'Senado' : 'Cámara de Diputados'}
            {añoSeleccionado && ` del año ${añoSeleccionado}`}
          </p>
        </div>
      </Card>

      {/* Actas List */}
      <Card variant="elevated" padding="lg">
        {actasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className="text-4xl text-secondary mx-auto mb-3" />
            <p className="text-secondary">No se encontraron actas con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-panel border-b border-border/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                    Reunión
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider hidden md:table-cell">
                    Periodo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {actasFiltradas.map((acta, index) => {
                  const categoria = categorizarActa(acta);
                  const colorClass = getCategoriaColor(categoria);
                  const isExpanded = expandedActa === acta.id;

                  return (
                    <React.Fragment key={`${acta.id}-${index}`}>
                      {/* Main row */}
                      <tr className="hover:bg-panel/10 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                          {new Date(acta.fecha).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${colorClass}`}
                          >
                            {categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {acta.numero_reunion !== undefined && acta.numero_reunion !== null
                            ? `Nº ${acta.numero_reunion}`
                            : new Date(acta.fecha).getFullYear()}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary hidden md:table-cell">
                          {acta.periodo && acta.periodo.trim() !== ''
                            ? acta.periodo
                            : `${categoria} ${new Date(acta.fecha).getFullYear()}`}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {acta.url_pdf && (
                              <a
                                href={acta.url_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-foreground hover:text-brand transition-colors"
                                onClick={handleStopPropagation}
                                title="Ver PDF"
                              >
                                <FaFileAlt />
                                <span className="hidden sm:inline">PDF</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleToggleExpand(acta.id)}
                              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-secondary hover:text-foreground transition-colors"
                              title={isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                            >
                              <span className="hidden sm:inline">
                                {isExpanded ? 'Ocultar' : 'Ver más'}
                              </span>
                              {isExpanded ? (
                                <FaChevronUp className="text-xs" />
                              ) : (
                                <FaChevronDown className="text-xs" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 bg-background/50">
                            <div className="space-y-4">
                              {/* Orden del día */}
                              {acta.orden_dia && (
                                <div>
                                  <h5 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                                    Orden del Día
                                  </h5>
                                  <p className="text-sm text-foreground leading-relaxed">
                                    {acta.orden_dia}
                                  </p>
                                </div>
                              )}

                              {/* Additional details grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                                <div>
                                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                    Fecha
                                  </p>
                                  <p className="text-sm text-foreground">
                                    {formatearFecha(acta.fecha)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                    Tipo de Sesión
                                  </p>
                                  <p className="text-sm text-foreground">{categoria}</p>
                                </div>

                                {acta.numero_reunion !== undefined &&
                                  acta.numero_reunion !== null && (
                                    <div>
                                      <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                        Número de Reunión
                                      </p>
                                      <p className="text-sm text-foreground">
                                        Nº {acta.numero_reunion}
                                      </p>
                                    </div>
                                  )}

                                {acta.periodo && acta.periodo.trim() !== '' && (
                                  <div>
                                    <p className="text-xs text-secondary uppercase tracking-wider mb-1">
                                      Periodo Legislativo
                                    </p>
                                    <p className="text-sm text-foreground">{acta.periodo}</p>
                                  </div>
                                )}
                              </div>

                              {/* PDF link if available */}
                              {acta.url_pdf && (
                                <div className="pt-2 border-t border-border/10">
                                  <a
                                    href={acta.url_pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
                                    onClick={handleStopPropagation}
                                  >
                                    <FaExternalLinkAlt className="text-xs" />
                                    Abrir documento oficial en nueva pestaña
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {actasFiltradas.length >= limit && (
          <div className="mt-6 pt-4 border-t border-border/10 text-center">
            <p className="text-sm text-secondary">
              Mostrando las primeras {limit} actas. Usa los filtros para refinar la búsqueda.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
});
