/**
 * useDashboardData Hook
 *
 * Single Responsibility: Centralize all data fetching for dashboard
 * Separates business logic from presentation
 */

import { useState } from 'react';
import { useDolarVariations } from './useDolarVariations';
import { useCotizacionesWithVariations } from './useCotizaciones';
import { useCryptoQuery } from './useCryptoQuery';
import { useDolarByType } from './useDolarQuery';
import { useFredData } from './useFredData';
import { useECBRates } from './useECBRates';
import { useECBHistorical } from './useECBHistorical';
import { useInflacion } from './useInflacion';
import type { DolarType } from '@/types/api/dolar';

export function useDashboardData() {
  const [cryptoPage, setCryptoPage] = useState(1);
  const [selectedDolarType, setSelectedDolarType] = useState<DolarType>('cripto');
  const cryptoPerPage = 15;

  // Data queries
  const { data: dolares, isLoading: loadingDolares } = useDolarVariations();
  const { data: cotizaciones, isLoading: loadingCotizaciones } = useCotizacionesWithVariations();
  const { data: cryptos, isLoading: loadingCryptos } = useCryptoQuery(cryptoPage, cryptoPerPage);
  const { data: selectedDolar } = useDolarByType(selectedDolarType);
  const { data: fredData, isLoading: fredLoading } = useFredData();
  const { data: ecbData, isLoading: ecbLoading } = useECBRates();
  const { data: ecbHistorical, isLoading: ecbHistoricalLoading } = useECBHistorical();
  const { data: inflacionData, isLoading: inflacionLoading } = useInflacion();

  return {
    // Data
    dolares,
    cotizaciones,
    cryptos,
    selectedDolar,
    fredData,
    ecbData,
    ecbHistorical,
    inflacionData,

    // Loading states
    loadingDolares,
    loadingCotizaciones,
    loadingCryptos,
    fredLoading,
    ecbLoading,
    ecbHistoricalLoading,
    inflacionLoading,

    // Crypto pagination
    cryptoPage,
    setCryptoPage,
    cryptoPerPage,

    // Dolar type selection
    selectedDolarType,
    setSelectedDolarType,
  };
}
