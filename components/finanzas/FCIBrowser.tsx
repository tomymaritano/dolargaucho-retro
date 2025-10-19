import React, { useState } from 'react';
import { useAllFCI } from '@/hooks/useFinanzas';
import { Card } from '@/components/ui/Card/Card';
import { FaSpinner, FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';

type TipoFCI =
  | 'Todos'
  | 'Mercado de Dinero'
  | 'Renta Variable'
  | 'Renta Fija'
  | 'Renta Mixta'
  | 'Otros';
type MonedaFCI = 'Todas' | 'ARS' | 'USD' | 'EUR';
type ClaseFCI = 'Todas' | 'A' | 'B' | 'C';

export function FCIBrowser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<TipoFCI>('Todos');
  const [monedaFilter, setMonedaFilter] = useState<MonedaFCI>('Todas');
  const [claseFilter, setClaseFilter] = useState<ClaseFCI>('Todas');

  const { data: fciData, isLoading } = useAllFCI();

  const filteredFCI = React.useMemo(() => {
    if (!fciData) return [];

    // fciData ya es un array de FCIs combinados
    const allFCIs = Array.isArray(fciData) ? fciData : [];

    return allFCIs.filter((fci) => {
      // Validar que tenga las propiedades necesarias
      if (!fci?.nombre) return false;

      const nombre = fci.nombre || '';

      // Búsqueda por nombre
      const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo
      const matchesTipo = tipoFilter === 'Todos' || fci.tipo === tipoFilter;

      // Filtro por moneda
      const matchesMoneda = monedaFilter === 'Todas' || fci.moneda === monedaFilter;

      // Filtro por clase
      const matchesClase = claseFilter === 'Todas' || fci.clase === claseFilter;

      return matchesSearch && matchesTipo && matchesMoneda && matchesClase;
    });
  }, [fciData, searchTerm, tipoFilter, monedaFilter, claseFilter]);

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center h-80">
          <FaSpinner className="animate-spin text-4xl text-brand" />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <Card.Title>Fondos Comunes de Inversión (FCI)</Card.Title>
        <p className="text-sm text-secondary mt-1">
          Explora {filteredFCI.length} fondos disponibles
        </p>
      </Card.Header>

      <Card.Content>
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Búsqueda */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Buscar fondo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-light border border-white/10 rounded-lg text-white placeholder-secondary focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          {/* Tipo */}
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value as TipoFCI)}
            className="px-4 py-2 bg-dark-light border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
          >
            <option value="Todos">Todos los tipos</option>
            <option value="Mercado de Dinero">Mercado de Dinero</option>
            <option value="Renta Variable">Renta Variable</option>
            <option value="Renta Fija">Renta Fija</option>
            <option value="Renta Mixta">Renta Mixta</option>
            <option value="Otros">Otros</option>
          </select>

          {/* Moneda */}
          <select
            value={monedaFilter}
            onChange={(e) => setMonedaFilter(e.target.value as MonedaFCI)}
            className="px-4 py-2 bg-dark-light border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
          >
            <option value="Todas">Todas las monedas</option>
            <option value="ARS">ARS - Pesos</option>
            <option value="USD">USD - Dólares</option>
            <option value="EUR">EUR - Euros</option>
          </select>

          {/* Clase */}
          <select
            value={claseFilter}
            onChange={(e) => setClaseFilter(e.target.value as ClaseFCI)}
            className="px-4 py-2 bg-dark-light border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
          >
            <option value="Todas">Todas las clases</option>
            <option value="A">Clase A</option>
            <option value="B">Clase B</option>
            <option value="C">Clase C</option>
          </select>
        </div>

        {/* Tabla de FCIs */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Fondo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Tipo</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Clase</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-secondary">VCP</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-secondary">
                  Variación
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-secondary">
                  Patrimonio
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFCI.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-secondary">
                    No se encontraron fondos con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                filteredFCI.slice(0, 50).map((fci, index) => {
                  const nombre = fci.nombre || 'N/A';
                  const vcp = fci.vcp || 0;
                  const variacion =
                    fci.variacion_diaria || fci.variacion_semanal || fci.variacion_mensual || 0;
                  const patrimonio = fci.patrimonio || 0;
                  const isPositive = variacion >= 0;

                  return (
                    <tr
                      key={`${nombre}-${index}`}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium text-sm">{nombre}</p>
                          <p className="text-xs text-secondary">{fci.moneda || 'ARS'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-secondary">{fci.tipo || '-'}</span>
                      </td>
                      <td className="py-3 px-4">
                        {fci.clase ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand/20 text-brand">
                            {fci.clase}
                          </span>
                        ) : (
                          <span className="text-sm text-secondary">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white font-semibold">
                          {vcp ? `$${vcp.toFixed(4)}` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {variacion !== 0 ? (
                          <div
                            className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {isPositive ? (
                              <FaArrowUp className="text-xs" />
                            ) : (
                              <FaArrowDown className="text-xs" />
                            )}
                            <span className="font-semibold">
                              {isPositive ? '+' : ''}
                              {variacion.toFixed(2)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-secondary text-sm">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-secondary text-sm">
                        {patrimonio ? `$${patrimonio.toLocaleString('es-AR')}` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredFCI.length > 50 && (
          <div className="mt-4 text-center text-sm text-secondary">
            Mostrando 50 de {filteredFCI.length} fondos. Usa los filtros para refinar tu búsqueda.
          </div>
        )}
      </Card.Content>

      <Card.Footer>
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>Fuente: ArgentinaData API</span>
          <span>VCP: Valor Cuota Parte</span>
        </div>
      </Card.Footer>
    </Card>
  );
}
