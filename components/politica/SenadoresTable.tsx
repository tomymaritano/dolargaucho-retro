'use client';

import React, { useState } from 'react';
import { useSenadores } from '@/hooks/usePolitica';
import { Card } from '@/components/ui/Card/Card';
import { FaUser, FaMapMarkerAlt, FaUsers, FaSearch, FaSpinner } from 'react-icons/fa';

export function SenadoresTable() {
  const { data: senadores, isLoading, error } = useSenadores();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedBloque, setSelectedBloque] = useState<string>('');

  // Filter senadores
  const filteredSenadores = React.useMemo(() => {
    if (!senadores) return [];

    return senadores.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        s.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.apellido.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProvincia = !selectedProvincia || s.provincia === selectedProvincia;
      const matchesBloque = !selectedBloque || s.bloque === selectedBloque;

      return matchesSearch && matchesProvincia && matchesBloque;
    });
  }, [senadores, searchTerm, selectedProvincia, selectedBloque]);

  // Get unique provincias and bloques
  const provincias = React.useMemo(() => {
    if (!senadores) return [];
    return Array.from(new Set(senadores.map((s) => s.provincia))).sort();
  }, [senadores]);

  const bloques = React.useMemo(() => {
    if (!senadores) return [];
    return Array.from(new Set(senadores.map((s) => s.bloque))).sort();
  }, [senadores]);

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <FaSpinner className="animate-spin text-accent-emerald text-4xl" />
          <p className="text-secondary">Cargando senadores...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-error text-lg font-semibold">Error al cargar senadores</p>
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
            {bloques.map((b, idx) => (
              <option key={`${b}-${idx}`} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-secondary">
            Mostrando{' '}
            <span className="text-accent-emerald font-semibold">{filteredSenadores.length}</span> de{' '}
            <span className="text-white font-semibold">{senadores?.length || 0}</span> senadores
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
                  Senador
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
              {filteredSenadores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-secondary">No se encontraron senadores</p>
                  </td>
                </tr>
              ) : (
                filteredSenadores.map((senador, index) => (
                  <tr
                    key={`${senador.nombre}-${senador.apellido}-${index}`}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center">
                          <FaUser className="text-accent-emerald" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {senador.nombre_completo || `${senador.nombre} ${senador.apellido}`}
                          </p>
                          {senador.email && (
                            <p className="text-xs text-secondary mt-0.5">{senador.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{senador.provincia}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                        {senador.bloque}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {senador.mandato_inicio && senador.mandato_fin ? (
                          <p className="text-white">
                            {new Date(senador.mandato_inicio).getFullYear()} -{' '}
                            {new Date(senador.mandato_fin).getFullYear()}
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
