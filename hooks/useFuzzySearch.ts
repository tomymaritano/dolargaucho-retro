import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { useDolarQuery } from './useDolarQuery';
import { useCotizaciones } from './useCotizaciones';
import { FUSE_CONFIG, SEARCH_CONFIG } from '@/lib/config/search';

export type SearchResultType = 'dolar' | 'currency' | 'page' | 'calculator';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
  value?: string;
  icon?: string;
}

// Static pages
const staticPages: SearchResult[] = [
  {
    id: 'dashboard',
    type: 'page',
    title: 'Dashboard',
    subtitle: 'Vista general',
    href: '/dashboard',
    icon: '📊',
  },
  {
    id: 'favoritos',
    type: 'page',
    title: 'Favoritos',
    subtitle: 'Mis cotizaciones favoritas',
    href: '/dashboard/favoritos',
    icon: '⭐',
  },
  {
    id: 'analisis',
    type: 'page',
    title: 'Análisis',
    subtitle: 'Análisis de mercado',
    href: '/dashboard/analisis',
    icon: '📈',
  },
  {
    id: 'alertas',
    type: 'page',
    title: 'Alertas',
    subtitle: 'Notificaciones',
    href: '/dashboard/alertas',
    icon: '🔔',
  },
  {
    id: 'calendario',
    type: 'page',
    title: 'Calendario',
    subtitle: 'Eventos económicos',
    href: '/dashboard/calendario',
    icon: '📅',
  },
];

export function useFuzzySearch(query: string) {
  const { data: dolares } = useDolarQuery();
  const { data: cotizaciones } = useCotizaciones();

  // Build searchable data
  const searchData = useMemo(() => {
    const data: SearchResult[] = [...staticPages];

    // Add dolares
    if (dolares) {
      dolares.forEach((dolar) => {
        data.push({
          id: `dolar-${dolar.casa}`,
          type: 'dolar',
          title: `Dólar ${dolar.nombre}`,
          subtitle: `Venta: $${dolar.venta.toFixed(2)}`,
          href: '/dashboard',
          value: dolar.venta.toFixed(2),
          icon: '💵',
        });
      });
    }

    // Add currencies
    if (cotizaciones) {
      cotizaciones.forEach((cotizacion) => {
        data.push({
          id: `currency-${cotizacion.moneda}`,
          type: 'currency',
          title: cotizacion.nombre,
          subtitle: `${cotizacion.moneda} - $${cotizacion.venta.toFixed(2)}`,
          href: '/dashboard',
          value: cotizacion.venta.toFixed(2),
          icon: '💱',
        });
      });
    }

    return data;
  }, [dolares, cotizaciones]);

  // Configure Fuse.js with centralized config
  const fuse = useMemo(() => {
    return new Fuse(searchData, FUSE_CONFIG);
  }, [searchData]);

  // Perform search
  const results = useMemo(() => {
    if (!query || query.length < SEARCH_CONFIG.minQueryLength) {
      return [];
    }

    const fuseResults = fuse.search(query);
    return fuseResults.map((result) => result.item).slice(0, SEARCH_CONFIG.maxResults);
  }, [query, fuse]);

  return {
    results,
    isSearching: query.length >= SEARCH_CONFIG.minQueryLength,
  };
}
