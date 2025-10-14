import { useQuery } from '@tanstack/react-query';

// Series IDs de FRED
export const FRED_SERIES = {
  FEDERAL_FUNDS_RATE: 'FEDFUNDS', // Tasa de interés de la FED
  INFLATION_CPI: 'CPIAUCSL', // Índice de precios al consumidor
  GDP_REAL: 'GDPC1', // PIB real
  UNEMPLOYMENT_RATE: 'UNRATE', // Tasa de desempleo
  TREASURY_10Y: 'DGS10', // Tasa de bonos del tesoro a 10 años
  M2_MONEY_SUPPLY: 'M2SL', // Oferta monetaria M2
  DOLLAR_INDEX: 'DTWEXBGS', // Índice del dólar (Trade Weighted)
} as const;

interface FredObservation {
  date: string;
  value: string;
  realtime_start: string;
  realtime_end: string;
}

interface FredResponse {
  observations: FredObservation[];
}

interface FredDataPoint {
  date: string;
  value: number;
}

interface FredIndicator {
  latest: number;
  previousMonth: number;
  change: number;
  changePercent: number;
  data: FredDataPoint[];
  lastUpdate: string;
}

// Fallback data para cuando no hay API key
const FALLBACK_DATA = {
  FEDFUNDS: { latest: 5.33, previousMonth: 5.33, lastUpdate: '2024-03-01' },
  CPIAUCSL: { latest: 314.54, previousMonth: 313.05, lastUpdate: '2024-03-01' }, // Inflación ~3.2% YoY
  GDPC1: { latest: 22274.2, previousMonth: 22049.5, lastUpdate: '2023-12-01' }, // +2.8% growth
  UNRATE: { latest: 3.9, previousMonth: 3.7, lastUpdate: '2024-03-01' },
  DGS10: { latest: 4.35, previousMonth: 4.25, lastUpdate: '2024-03-01' },
  M2SL: { latest: 20874.2, previousMonth: 20812.3, lastUpdate: '2024-02-01' },
  DTWEXBGS: { latest: 113.45, previousMonth: 112.89, lastUpdate: '2024-03-01' },
};

async function fetchFredSeries(seriesId: string, limit = 12): Promise<FredDataPoint[]> {
  const apiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

  if (!apiKey) {
    console.warn('FRED API key not found, using fallback data');
    return generateFallbackData(seriesId);
  }

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }

    const data: FredResponse = await response.json();

    return data.observations
      .map((obs) => ({
        date: obs.date,
        value: parseFloat(obs.value) || 0,
      }))
      .filter((point) => !isNaN(point.value))
      .reverse();
  } catch (error) {
    console.error(`Error fetching FRED data for ${seriesId}:`, error);
    return generateFallbackData(seriesId);
  }
}

function generateFallbackData(seriesId: string): FredDataPoint[] {
  const fallback = FALLBACK_DATA[seriesId as keyof typeof FALLBACK_DATA];
  if (!fallback) return [];

  // Generate 12 months of historical data with slight variations
  const data: FredDataPoint[] = [];
  const currentDate = new Date(fallback.lastUpdate);

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);

    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const value = i === 0 ? fallback.latest : fallback.latest * (1 + variation);

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
    });
  }

  return data;
}

function calculateIndicator(data: FredDataPoint[]): FredIndicator | null {
  if (data.length < 2) return null;

  const latest = data[data.length - 1].value;
  const previousMonth = data[data.length - 2].value;
  const change = latest - previousMonth;
  const changePercent = previousMonth !== 0 ? (change / previousMonth) * 100 : 0;

  return {
    latest,
    previousMonth,
    change,
    changePercent,
    data,
    lastUpdate: data[data.length - 1].date,
  };
}

// Calculate Year-over-Year inflation from CPI
function calculateInflationYoY(cpiData: FredDataPoint[]): number {
  if (cpiData.length < 12) return 0;

  const latestCPI = cpiData[cpiData.length - 1].value;
  const yearAgoCPI = cpiData[cpiData.length - 12].value;

  return yearAgoCPI !== 0 ? ((latestCPI - yearAgoCPI) / yearAgoCPI) * 100 : 0;
}

// Calculate Quarter-over-Quarter GDP growth
function calculateGDPGrowth(gdpData: FredDataPoint[]): number {
  if (gdpData.length < 2) return 0;

  const latest = gdpData[gdpData.length - 1].value;
  const previous = gdpData[gdpData.length - 2].value;

  return previous !== 0 ? ((latest - previous) / previous) * 100 : 0;
}

/**
 * Hook para obtener datos de la Federal Reserve (FRED)
 * Incluye múltiples indicadores económicos de USA
 */
export function useFredData() {
  return useQuery({
    queryKey: ['fred', 'indicators'],
    queryFn: async () => {
      const [
        fedfundsData,
        cpiData,
        gdpData,
        unrateData,
        treasury10yData,
        m2Data,
        dollarIndexData,
      ] = await Promise.all([
        fetchFredSeries(FRED_SERIES.FEDERAL_FUNDS_RATE, 24),
        fetchFredSeries(FRED_SERIES.INFLATION_CPI, 24),
        fetchFredSeries(FRED_SERIES.GDP_REAL, 12),
        fetchFredSeries(FRED_SERIES.UNEMPLOYMENT_RATE, 24),
        fetchFredSeries(FRED_SERIES.TREASURY_10Y, 24),
        fetchFredSeries(FRED_SERIES.M2_MONEY_SUPPLY, 24),
        fetchFredSeries(FRED_SERIES.DOLLAR_INDEX, 24),
      ]);

      return {
        federalFundsRate: calculateIndicator(fedfundsData),
        inflationCPI: {
          ...calculateIndicator(cpiData),
          yearOverYear: calculateInflationYoY(cpiData),
        },
        gdp: {
          ...calculateIndicator(gdpData),
          quarterlyGrowth: calculateGDPGrowth(gdpData),
        },
        unemploymentRate: calculateIndicator(unrateData),
        treasury10y: calculateIndicator(treasury10yData),
        m2MoneySupply: calculateIndicator(m2Data),
        dollarIndex: calculateIndicator(dollarIndexData),
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour - FRED data doesn't update frequently
    refetchInterval: 1000 * 60 * 60 * 6, // Refetch every 6 hours
    retry: 2,
  });
}

/**
 * Hook simplificado para obtener solo indicadores principales
 */
export function useFredMainIndicators() {
  const { data, isLoading, error } = useFredData();

  if (isLoading || error || !data) {
    return {
      federalFundsRate: null,
      inflationYoY: null,
      gdpGrowth: null,
      isLoading,
      error,
    };
  }

  return {
    federalFundsRate: data.federalFundsRate?.latest ?? null,
    inflationYoY: data.inflationCPI?.yearOverYear ?? null,
    gdpGrowth: data.gdp?.quarterlyGrowth ?? null,
    unemploymentRate: data.unemploymentRate?.latest ?? null,
    treasury10y: data.treasury10y?.latest ?? null,
    isLoading: false,
    error: null,
  };
}

/**
 * Hook para obtener datos históricos de una serie específica
 */
export function useFredSeries(seriesId: string, limit = 24) {
  return useQuery({
    queryKey: ['fred', 'series', seriesId, limit],
    queryFn: () => fetchFredSeries(seriesId, limit),
    staleTime: 1000 * 60 * 60,
    retry: 2,
  });
}
