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
import { useInflacionMensual } from './useFinanzas';
import { useDolarTypeStore } from '@/lib/store/dolarType';

export function useDashboardData() {
  const [cryptoPage, setCryptoPage] = useState(1);
  const cryptoPerPage = 15;

  // Get selected dolar type from global store
  const selectedDolarType = useDolarTypeStore((state) => state.selectedType);

  // Data queries
  const { data: dolares, isLoading: loadingDolares } = useDolarVariations();
  const { data: cotizaciones, isLoading: loadingCotizaciones } = useCotizacionesWithVariations();
  const { data: cryptos, isLoading: loadingCryptos } = useCryptoQuery(cryptoPage, cryptoPerPage);
  const { data: selectedDolar } = useDolarByType(selectedDolarType);
  const { data: fredData, isLoading: fredLoading } = useFredData();
  const { data: ecbData, isLoading: ecbLoading } = useECBRates();
  const { data: ecbHistorical, isLoading: ecbHistoricalLoading } = useECBHistorical();
  const { data: inflacionData, isLoading: inflacionLoading } = useInflacionMensual();

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
  };
}
