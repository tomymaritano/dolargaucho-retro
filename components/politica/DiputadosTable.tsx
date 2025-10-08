'use client';

import React, { useState } from 'react';
import { useDiputados } from '@/hooks/usePolitica';
import { Card } from '@/components/ui/Card/Card';
import { FaUser, FaMapMarkerAlt, FaUsers, FaSearch, FaSpinner } from 'react-icons/fa';

export function DiputadosTable() {
  const { data: diputados, isLoading, error } = useDiputados();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedBloque, setSelectedBloque] = useState<string>('');

  // Filter diputados
  const filteredDiputados = React.useMemo(() => {
    if (!diputados) return [];

    return diputados.filter((d) => {
      const matchesSearch =
        !searchTerm ||
        d.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.apellido.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProvincia = !selectedProvincia || d.provincia === selectedProvincia;
      const matchesBloque = !selectedBloque || d.bloque === selectedBloque;

      return matchesSearch && matchesProvincia && matchesBloque;
    });
  }, [diputados, searchTerm, selectedProvincia, selectedBloque]);

  // Get unique provincias and bloques
  const provincias = React.useMemo(() => {
    if (!diputados) return [];
    return Array.from(new Set(diputados.map((d) => d.provincia))).sort();
  }, [diputados]);

  const bloques = React.useMemo(() => {
    if (!diputados) return [];
    return Array.from(new Set(diputados.map((d) => d.bloque))).sort();
  }, [diputados]);

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <FaSpinner className="animate-spin text-accent-emerald text-4xl" />
          <p className="text-secondary">Cargando diputados...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-error text-lg font-semibold">Error al cargar diputados</p>
          <p className="text-secondary text-sm">Intenta nuevamente más tarde</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card variant="elevated" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-light border border-white/10 rounded-lg text-white placeholder-secondary focus:outline-none focus:border-accent-emerald/50 focus:ring-2 focus:ring-accent-emerald/20 transition-all"
            />
          </div>

          {/* Provincia Filter */}
          <select
            value={selectedProvincia}
            onChange={(e) => setSelectedProvincia(e.target.value)}
            className="px-4 py-2.5 bg-dark-light border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-emerald/50 focus:ring-2 focus:ring-accent-emerald/20 transition-all"
          >
            <option value="">Todas las provincias</option>
            {provincias.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Bloque Filter */}
          <select
            value={selectedBloque}
            onChange={(e) => setSelectedBloque(e.target.value)}
            className="px-4 py-2.5 bg-dark-light border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent-emerald/50 focus:ring-2 focus:ring-accent-emerald/20 transition-all"
          >
            <option value="">Todos los bloques</option>
            {bloques.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-secondary">
            Mostrando{' '}
            <span className="text-accent-emerald font-semibold">{filteredDiputados.length}</span> de{' '}
            <span className="text-white font-semibold">{diputados?.length || 0}</span> diputados
          </p>
        </div>
      </Card>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-light border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Diputado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-accent-emerald" />
                    Provincia
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-accent-emerald" />
                    Bloque
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Mandato
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDiputados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-secondary">No se encontraron diputados</p>
                  </td>
                </tr>
              ) : (
                filteredDiputados.map((diputado, index) => (
                  <tr
                    key={`${diputado.nombre}-${diputado.apellido}-${index}`}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center">
                          <FaUser className="text-accent-emerald" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {diputado.nombre_completo || `${diputado.nombre} ${diputado.apellido}`}
                          </p>
                          {diputado.email && (
                            <p className="text-xs text-secondary mt-0.5">{diputado.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{diputado.provincia}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                        {diputado.bloque}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {diputado.mandato_inicio && diputado.mandato_fin ? (
                          <p className="text-white">
                            {new Date(diputado.mandato_inicio).getFullYear()} -{' '}
                            {new Date(diputado.mandato_fin).getFullYear()}
                          </p>
                        ) : (
                          <p className="text-secondary">N/A</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
