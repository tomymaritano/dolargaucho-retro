import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { FredChart } from '@/components/charts/FredChart';
import { CryptoSparkline } from '@/components/charts/CryptoSparkline';
import { DolaresTable } from '@/components/tables/DolaresTable';
import { CotizacionesTable } from '@/components/tables/CotizacionesTable';
import Toast from '@/components/toast';
import { useToast } from '@/hooks/useToast';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { useDolarByType } from '@/hooks/useDolarQuery';
import { useCotizacionesWithVariations } from '@/hooks/useCotizaciones';
import { useCryptoQuery } from '@/hooks/useCryptoQuery';
import type { DolarType } from '@/types/api/dolar';
import { useFredData } from '@/hooks/useFredData';
import { useECBRates } from '@/hooks/useECBRates';
import { useECBHistorical } from '@/hooks/useECBHistorical';
import { useInflacion } from '@/hooks/useInflacion';
import { useFavoritesStore } from '@/lib/store/favorites';
import {
  FaStar,
  FaChartLine,
  FaGlobeAmericas,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaRegStar,
  FaRocket,
  FaBitcoin,
  FaUniversity,
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
} from 'react-icons/fa';

export default function DashboardPage() {
  const [showFredCharts, setShowFredCharts] = useState(false);
  const [showECBCharts, setShowECBCharts] = useState(false);
  const [cryptoPage, setCryptoPage] = useState(1);
  const cryptoPerPage = 15; // Reducido para el dashboard principal
  const [selectedDolarType, setSelectedDolarType] = useState<DolarType>('cripto'); // Tipo de cambio para ARS

  const { toast, showToast, hideToast } = useToast();
  const { data: dolares, isLoading: loadingDolares } = useDolarVariations();
  const { data: cotizaciones, isLoading: loadingCotizaciones } = useCotizacionesWithVariations();
  const { data: cryptos, isLoading: loadingCryptos } = useCryptoQuery(cryptoPage, cryptoPerPage);
  const { data: selectedDolar } = useDolarByType(selectedDolarType); // Dólar para convertir a ARS
  const { data: fredData, isLoading: fredLoading } = useFredData();
  const { data: ecbData, isLoading: ecbLoading } = useECBRates();
  const { data: ecbHistorical, isLoading: ecbHistoricalLoading } = useECBHistorical();
  const { data: inflacionData, isLoading: inflacionLoading } = useInflacion();

  const {
    dolares: favoriteDolarIds,
    currencies: favoriteCurrencyIds,
    cryptos: favoriteCryptoIds,
    charts: favoriteChartIds,
    toggleDolar,
    toggleCurrency,
    toggleCrypto,
    toggleChart,
  } = useFavoritesStore();

  // Handler para toggle de gráficos con notificaciones toast
  const handleToggleChart = (chartId: string) => {
    const result = toggleChart(chartId);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      // Error messages (like limit reached) should stay longer
      showToast(result.message, 'error', 5000); // 5 seconds for errors
    }
  };

  // Get all favorites (dolares + currencies + cryptos) for top section
  const favoriteDolares = dolares?.filter((d) => favoriteDolarIds.includes(d.casa)) || [];
  const favoriteCurrencies =
    cotizaciones?.filter((c) => favoriteCurrencyIds.includes(c.moneda)) || [];
  const favoriteCryptos = cryptos?.filter((c) => favoriteCryptoIds.includes(c.id)) || [];

  // Combine all three for featured section
  const allFavorites = [...favoriteDolares, ...favoriteCurrencies, ...favoriteCryptos];

  return (
    <DashboardLayout>
      {/* Hero Banner - Placeholder Multimedia */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-emerald/10 via-background to-accent-teal/10 border border-accent-emerald/20 hover:border-accent-emerald/40 transition-all group">
        {/* Imagen de fondo (placeholder para que agregues tu imagen) */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-emerald/5 to-accent-teal/5 opacity-50" />

        {/* Contenido */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
          {/* Ícono/Imagen Principal */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-accent-emerald/30 to-accent-teal/30 backdrop-blur-sm border border-accent-emerald/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FaRocket className="text-5xl md:text-6xl text-accent-emerald" />
              {/*
                Reemplazá el ícono por tu imagen:
                <img
                  src="/path/to/your/image.jpg"
                  alt="Feature"
                  className="w-full h-full object-cover rounded-2xl"
                />
              */}
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text">
                Contenido Destacado
              </h2>
              <span className="px-2 py-1 text-xs bg-accent-emerald text-background-dark rounded-full font-bold uppercase">
                Nuevo
              </span>
            </div>
            <p className="text-secondary text-sm md:text-base mb-4">
              Este es un espacio destacado para promocionar contenido, funcionalidades nuevas o
              anuncios importantes. Podés personalizarlo con imágenes y enlaces a cualquier sección.
            </p>
            <Link
              href="/dashboard/calculadoras"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-emerald/20 hover:bg-accent-emerald/30 text-accent-emerald font-semibold transition-all group-hover:gap-3"
            >
              Ver más
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-emerald/5 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-teal/5 rounded-full blur-3xl -z-0" />
      </div>

      {/* Quick Stats Grid - Favorites (TABLA PROFESIONAL) */}
      {allFavorites.length > 0 ? (
        <Card variant="elevated" padding="none" className="mb-8">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <FaStar className="text-accent-emerald text-xl" />
              <h2 className="text-xl font-bold text-foreground">Mis Favoritos</h2>
            </div>
            <p className="text-sm text-secondary mt-1">
              {allFavorites.length} {allFavorites.length === 1 ? 'favorito' : 'favoritos'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-center py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-12">
                    <FaStar className="inline-block text-accent-emerald" />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    24h %
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFavorites.map((item) => {
                  // Check if it's a dollar, currency, or crypto
                  const isDolar = 'casa' in item && 'moneda' in item && item.moneda === 'USD';
                  const isCrypto = 'symbol' in item && 'market_cap' in item;

                  if (isDolar) {
                    const dolar = item;
                    const { trend, percentage } = dolar.variation;
                    const TrendIcon =
                      trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
                    const trendColor =
                      trend === 'up'
                        ? 'text-error'
                        : trend === 'down'
                          ? 'text-success'
                          : 'text-warning';

                    return (
                      <tr
                        key={`dolar-${dolar.casa}`}
                        className="border-b border-border hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleDolar(dolar.casa)}
                            className="p-2 rounded-lg text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 transition-all"
                            aria-label="Quitar de favoritos"
                          >
                            <FaStar className="text-base" />
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">
                            USD
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-semibold text-foreground">{dolar.nombre}</p>
                          <p className="text-xs text-secondary">{dolar.casa}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold text-accent-emerald tabular-nums">
                            ${dolar.venta.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                            <TrendIcon className="text-xs" />
                            <span className="text-sm font-bold tabular-nums">
                              {percentage.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  } else if (isCrypto) {
                    const crypto = item;
                    const getTrendData = (percentage: number) => {
                      if (percentage > 0) return { icon: FaArrowUp, color: 'text-success' };
                      if (percentage < 0) return { icon: FaArrowDown, color: 'text-error' };
                      return { icon: FaMinus, color: 'text-warning' };
                    };
                    const trend24h = getTrendData(crypto.price_change_percentage_24h);
                    const TrendIcon = trend24h.icon;

                    return (
                      <tr
                        key={`crypto-${crypto.id}`}
                        className="border-b border-border hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleCrypto(crypto.id)}
                            className="p-2 rounded-lg text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 transition-all"
                            aria-label="Quitar de favoritos"
                          >
                            <FaStar className="text-base" />
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-500/20 text-orange-400">
                            CRYPTO
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="w-6 h-6 rounded-full"
                              loading="lazy"
                            />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
                              <p className="text-xs text-secondary uppercase">{crypto.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold text-accent-emerald tabular-nums">
                            ${crypto.current_price.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
                            <TrendIcon className="text-xs" />
                            <span className="text-sm font-bold tabular-nums">
                              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    const cotizacion = item;
                    const { trend, percentage } = cotizacion.variation;
                    const TrendIcon =
                      trend === 'up' ? FaArrowUp : trend === 'down' ? FaArrowDown : FaMinus;
                    const trendColor =
                      trend === 'up'
                        ? 'text-error'
                        : trend === 'down'
                          ? 'text-success'
                          : 'text-warning';

                    return (
                      <tr
                        key={`currency-${cotizacion.moneda}`}
                        className="border-b border-border hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleCurrency(cotizacion.moneda)}
                            className="p-2 rounded-lg text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 transition-all"
                            aria-label="Quitar de favoritos"
                          >
                            <FaStar className="text-base" />
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-500/20 text-purple-400">
                            {cotizacion.moneda}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-semibold text-foreground">
                            {cotizacion.nombre}
                          </p>
                          <p className="text-xs text-secondary">{cotizacion.casa}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold text-accent-emerald tabular-nums">
                            ${cotizacion.venta.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`inline-flex items-center gap-1 ${trendColor}`}>
                            <TrendIcon className="text-xs" />
                            <span className="text-sm font-bold tabular-nums">
                              {percentage.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        // No favorites - show message
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="text-center py-8">
            <FaStar className="text-5xl text-secondary/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No tenés favoritos</h3>
            <p className="text-secondary mb-4">
              Agregá tus cotizaciones favoritas para verlas acá rápidamente
            </p>
            <p className="text-sm text-secondary">
              Hacé clic en la estrella ⭐ de cualquier cotización para agregarla a favoritos
            </p>
          </div>
        </Card>
      )}

      {/* Gráficos Favoritos */}
      {favoriteChartIds.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-accent-emerald text-xl" />
              <h2 className="text-xl font-bold text-foreground">Mis Gráficos Favoritos</h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  favoriteChartIds.length >= 3
                    ? 'bg-warning/20 text-warning'
                    : 'bg-accent-emerald/20 text-accent-emerald'
                }`}
              >
                {favoriteChartIds.length}/3
              </span>
              <span className="text-xs text-secondary hidden sm:block">gráficos guardados</span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteChartIds.map((chartId) => {
                // Mapeo de chartId a datos del gráfico
                let chartData = null;
                let chartTitle = '';
                let chartColor = '';
                let yAxisLabel = '';
                let formatValue = (v: number) => v.toFixed(2);

                if (chartId === 'inflacion-argentina' && inflacionData) {
                  chartData = inflacionData.map((d) => ({ date: d.fecha, value: d.valor }));
                  chartTitle = 'Inflación Argentina';
                  chartColor = '#f87171';
                  yAxisLabel = 'Inflación';
                  formatValue = (v) => `${v.toFixed(1)}%`;
                } else if (chartId === 'fred-rate' && fredData?.federalFundsRate?.data) {
                  chartData = fredData.federalFundsRate.data;
                  chartTitle = 'Tasa FED';
                  chartColor = '#3b82f6';
                  yAxisLabel = 'Tasa';
                  formatValue = (v) => `${v.toFixed(2)}%`;
                } else if (chartId === 'fred-cpi' && fredData?.inflationCPI?.data) {
                  chartData = fredData.inflationCPI.data;
                  chartTitle = 'CPI USA';
                  chartColor = '#8b5cf6';
                  yAxisLabel = 'Índice';
                  formatValue = (v) => v.toFixed(1);
                } else if (chartId === 'fred-unemployment' && fredData?.unemploymentRate?.data) {
                  chartData = fredData.unemploymentRate.data;
                  chartTitle = 'Desempleo USA';
                  chartColor = '#10b981';
                  yAxisLabel = 'Tasa';
                  formatValue = (v) => `${v.toFixed(1)}%`;
                } else if (chartId === 'fred-treasury' && fredData?.treasury10y?.data) {
                  chartData = fredData.treasury10y.data;
                  chartTitle = 'Treasury 10Y';
                  chartColor = '#f59e0b';
                  yAxisLabel = 'Rendimiento';
                  formatValue = (v) => `${v.toFixed(2)}%`;
                } else if (chartId === 'ecb-usd' && ecbHistorical?.USD?.data) {
                  chartData = ecbHistorical.USD.data.map((d) => ({ date: d.date, value: d.rate }));
                  chartTitle = 'EUR / USD';
                  chartColor = '#6366f1';
                  yAxisLabel = 'Tipo de cambio';
                  formatValue = (v) => `$${v.toFixed(4)}`;
                } else if (chartId === 'ecb-ars' && ecbHistorical?.ARS?.data) {
                  chartData = ecbHistorical.ARS.data.map((d) => ({ date: d.date, value: d.rate }));
                  chartTitle = 'EUR / ARS';
                  chartColor = '#8b5cf6';
                  yAxisLabel = 'Tipo de cambio';
                  formatValue = (v) => `$${v.toFixed(2)}`;
                } else if (chartId === 'ecb-gbp' && ecbHistorical?.GBP?.data) {
                  chartData = ecbHistorical.GBP.data.map((d) => ({ date: d.date, value: d.rate }));
                  chartTitle = 'EUR / GBP';
                  chartColor = '#10b981';
                  yAxisLabel = 'Tipo de cambio';
                  formatValue = (v) => `$${v.toFixed(4)}`;
                } else if (chartId === 'ecb-brl' && ecbHistorical?.BRL?.data) {
                  chartData = ecbHistorical.BRL.data.map((d) => ({ date: d.date, value: d.rate }));
                  chartTitle = 'EUR / BRL';
                  chartColor = '#f59e0b';
                  yAxisLabel = 'Tipo de cambio';
                  formatValue = (v) => `R$${v.toFixed(4)}`;
                }

                if (!chartData) return null;

                return (
                  <Card key={chartId} variant="default" padding="md" className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground">{chartTitle}</h3>
                      <button
                        onClick={() => handleToggleChart(chartId)}
                        className="p-1.5 rounded-lg bg-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald/30 transition-all"
                        aria-label="Quitar de favoritos"
                      >
                        <FaStar className="text-sm" />
                      </button>
                    </div>
                    <div className="h-64">
                      <FredChart
                        data={chartData}
                        title={chartTitle}
                        color={chartColor}
                        yAxisLabel={yAxisLabel}
                        formatValue={formatValue}
                        showPoints={true}
                        monthsToShow={12}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inflación Argentina - 2 columnas (más ancho) */}
        <Card
          variant="elevated"
          padding="lg"
          className="lg:col-span-2 bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20"
        >
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <FaChartLine className="text-xl text-red-400" />
                </div>
                <div>
                  <Card.Title className="mb-0">Inflación Argentina</Card.Title>
                  <p className="text-xs text-secondary mt-1">
                    Índice de Precios al Consumidor (IPC)
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleChart('inflacion-argentina')}
                className={`p-2 rounded-lg transition-all ${
                  favoriteChartIds.includes('inflacion-argentina')
                    ? 'bg-accent-emerald/20 text-accent-emerald'
                    : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                }`}
                aria-label={
                  favoriteChartIds.includes('inflacion-argentina')
                    ? 'Quitar de favoritos'
                    : 'Agregar a favoritos'
                }
              >
                {favoriteChartIds.includes('inflacion-argentina') ? (
                  <FaStar className="text-lg" />
                ) : (
                  <FaRegStar className="text-lg" />
                )}
              </button>
            </div>
          </Card.Header>

          <Card.Content>
            {inflacionLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              </div>
            ) : inflacionData && inflacionData.length > 0 ? (
              <>
                {/* Gráfico con componente unificado */}
                <div className="h-64">
                  <FredChart
                    data={inflacionData.map((d) => ({ date: d.fecha, value: d.valor }))}
                    title="Inflación Argentina"
                    color="#f87171"
                    yAxisLabel="Inflación"
                    formatValue={(v) => `${v.toFixed(1)}%`}
                    showPoints={true}
                    monthsToShow={12}
                  />
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-secondary mb-1">Acumulada 12 meses</p>
                      <p className="text-lg font-bold text-red-400">
                        {inflacionData
                          .slice(-12)
                          .reduce((acc, m) => acc + m.valor, 0)
                          .toFixed(1)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary mb-1">Promedio mensual</p>
                      <p className="text-lg font-bold text-red-400">
                        {(
                          inflacionData.slice(-12).reduce((acc, m) => acc + m.valor, 0) / 12
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-secondary text-center py-8">No hay datos disponibles</p>
            )}
          </Card.Content>
        </Card>

        {/* Cotizaciones Internacionales - NUEVA TABLA PROFESIONAL */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <div className="flex items-center gap-3">
              <FaGlobeAmericas className="text-accent-emerald text-xl" />
              <Card.Title className="mb-0">Cotizaciones Internacionales</Card.Title>
            </div>
          </Card.Header>

          <Card.Content>
            <CotizacionesTable
              cotizaciones={cotizaciones || []}
              isLoading={loadingCotizaciones}
              favoriteCurrencyIds={favoriteCurrencyIds}
              onToggleFavorite={toggleCurrency}
            />
          </Card.Content>
        </Card>
      </div>

      {/* Criptomonedas - Todas */}
      {!loadingCryptos && cryptos && cryptos.length > 0 && (
        <Card variant="elevated" padding="lg" className="mt-6">
          <Card.Header>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <FaBitcoin className="text-accent-emerald text-xl" />
                <Card.Title className="mb-0">Todas las Criptomonedas</Card.Title>
              </div>

              {/* Selector de Tipo de Cambio */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary">Precio en ARS con:</span>
                <div className="flex gap-1">
                  {(['blue', 'oficial', 'cripto'] as DolarType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedDolarType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedDolarType === type
                          ? 'bg-accent-emerald text-background-dark'
                          : 'glass text-secondary hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      {type === 'blue' ? 'Blue' : type === 'oficial' ? 'Oficial' : 'Cripto'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card.Header>

          <Card.Content>
            {loadingCryptos ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center gap-4 p-3 glass rounded-lg"
                  >
                    <div className="h-10 w-10 bg-white/10 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-white/10 rounded w-32 mb-2" />
                      <div className="h-3 bg-white/10 rounded w-16" />
                    </div>
                    <div className="h-4 bg-white/10 rounded w-24" />
                    <div className="h-4 bg-white/10 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-center py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-12">
                        <FaStar className="inline-block text-accent-emerald" />
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-16">
                        #
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                        Precio USD
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                        Precio ARS
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                        24h %
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                        7D Trend
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                        Market Cap
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptos.map((crypto, index) => {
                      const isFavorite = favoriteCryptoIds.includes(crypto.id);
                      const getTrendData = (percentage: number) => {
                        if (percentage > 0) {
                          return { icon: FaArrowUp, color: 'text-success' };
                        }
                        if (percentage < 0) {
                          return { icon: FaArrowDown, color: 'text-error' };
                        }
                        return { icon: FaMinus, color: 'text-warning' };
                      };

                      const trend24h = getTrendData(crypto.price_change_percentage_24h);
                      const TrendIcon = trend24h.icon;

                      // Formatear números con separadores
                      const formatPrice = (price: number) => {
                        return new Intl.NumberFormat('es-AR', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: price < 1 ? 6 : 2,
                        }).format(price);
                      };

                      const formatMarketCap = (value: number) => {
                        if (value >= 1_000_000_000_000) {
                          return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
                        }
                        if (value >= 1_000_000_000) {
                          return `$${(value / 1_000_000_000).toFixed(2)}B`;
                        }
                        return `$${(value / 1_000_000).toFixed(2)}M`;
                      };

                      return (
                        <>
                          <tr
                            key={crypto.id}
                            className="border-b border-border hover:bg-white/5 transition-colors group"
                          >
                            {/* Favorito - Primera columna */}
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => toggleCrypto(crypto.id)}
                                className={`p-2 rounded-lg transition-all ${
                                  isFavorite
                                    ? 'text-accent-emerald bg-accent-emerald/10'
                                    : 'text-secondary hover:text-accent-emerald hover:bg-white/5'
                                }`}
                                aria-label={
                                  isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
                                }
                              >
                                {isFavorite ? (
                                  <FaStar className="text-base" />
                                ) : (
                                  <FaRegStar className="text-base" />
                                )}
                              </button>
                            </td>

                            {/* Ranking */}
                            <td className="py-3 px-4">
                              <span className="text-sm text-secondary font-medium">
                                {(cryptoPage - 1) * cryptoPerPage + index + 1}
                              </span>
                            </td>

                            {/* Logo + Nombre */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={crypto.image}
                                  alt={crypto.name}
                                  className="w-8 h-8 rounded-full"
                                  loading="lazy"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {crypto.name}
                                  </p>
                                  <p className="text-xs text-secondary uppercase">
                                    {crypto.symbol}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Precio USD */}
                            <td className="py-3 px-4 text-right">
                              <span className="text-sm font-semibold text-foreground tabular-nums">
                                {formatPrice(crypto.current_price)}
                              </span>
                            </td>

                            {/* Precio ARS */}
                            <td className="py-3 px-4 text-right">
                              {selectedDolar ? (
                                <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                                  $
                                  {(crypto.current_price * selectedDolar.venta).toLocaleString(
                                    'es-AR',
                                    {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-secondary">...</span>
                              )}
                            </td>

                            {/* 24h Change */}
                            <td className="py-3 px-4 text-right">
                              <div className={`inline-flex items-center gap-1 ${trend24h.color}`}>
                                <TrendIcon className="text-xs" />
                                <span className="text-sm font-bold tabular-nums">
                                  {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                                  {crypto.price_change_percentage_24h.toFixed(2)}%
                                </span>
                              </div>
                            </td>

                            {/* Sparkline 7D */}
                            <td className="py-3 px-4 text-center">
                              {crypto.sparkline_in_7d?.price &&
                              crypto.sparkline_in_7d.price.length > 0 ? (
                                <CryptoSparkline
                                  data={crypto.sparkline_in_7d.price}
                                  trend={
                                    crypto.price_change_percentage_24h > 0
                                      ? 'up'
                                      : crypto.price_change_percentage_24h < 0
                                        ? 'down'
                                        : 'neutral'
                                  }
                                />
                              ) : (
                                <span className="text-xs text-secondary">-</span>
                              )}
                            </td>

                            {/* Market Cap */}
                            <td className="py-3 px-4 text-right">
                              <span className="text-sm text-foreground tabular-nums">
                                {formatMarketCap(crypto.market_cap)}
                              </span>
                            </td>
                          </tr>

                          {/* Fila expandible con detalles (visible al hover) - NO TOMA ESPACIO cuando está oculta */}
                          <tr className="hidden group-hover:table-row bg-accent-emerald/5">
                            <td colSpan={8} className="py-2 px-4 border-b border-border">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <p className="text-secondary text-[10px] mb-0.5">24h High</p>
                                  <p className="font-semibold text-success text-xs">
                                    {formatPrice(crypto.high_24h)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary text-[10px] mb-0.5">24h Low</p>
                                  <p className="font-semibold text-error text-xs">
                                    {formatPrice(crypto.low_24h)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary text-[10px] mb-0.5">Volumen 24h</p>
                                  <p className="font-semibold text-foreground text-xs">
                                    {formatMarketCap(crypto.total_volume)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-secondary text-[10px] mb-0.5">Suministro</p>
                                  <p className="font-semibold text-foreground text-xs">
                                    {formatMarketCap(crypto.circulating_supply)}{' '}
                                    {crypto.symbol.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Controles de Paginación */}
            {!loadingCryptos && cryptos && cryptos.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                {/* Info de página */}
                <div className="text-sm text-secondary">
                  Mostrando {(cryptoPage - 1) * cryptoPerPage + 1} -{' '}
                  {(cryptoPage - 1) * cryptoPerPage + cryptos.length} criptomonedas
                </div>

                {/* Controles */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCryptoPage((prev) => Math.max(1, prev - 1))}
                    disabled={cryptoPage === 1}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      cryptoPage === 1
                        ? 'glass text-secondary/50 cursor-not-allowed'
                        : 'glass text-foreground hover:bg-white/10'
                    }`}
                  >
                    <FaChevronLeft className="text-xs" />
                    Anterior
                  </button>

                  <div className="px-4 py-2 glass rounded-lg">
                    <span className="text-sm font-semibold text-foreground">
                      Página {cryptoPage}
                    </span>
                  </div>

                  <button
                    onClick={() => setCryptoPage((prev) => prev + 1)}
                    disabled={cryptos.length < cryptoPerPage}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                      cryptos.length < cryptoPerPage
                        ? 'glass text-secondary/50 cursor-not-allowed'
                        : 'glass text-foreground hover:bg-white/10'
                    }`}
                  >
                    Siguiente
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      {/* FRED - Datos Económicos USA */}
      {!fredLoading && fredData && (
        <Card
          variant="elevated"
          padding="lg"
          className="mt-6 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20"
        >
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <FaUniversity className="text-xl text-blue-400" />
                </div>
                <div>
                  <Card.Title className="mb-0">Datos Económicos USA</Card.Title>
                  <p className="text-xs text-secondary mt-1">Reserva Federal (FRED)</p>
                </div>
              </div>
              <button
                onClick={() => setShowFredCharts(!showFredCharts)}
                className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaChartLine />
                {showFredCharts ? 'Ocultar Gráficos' : 'Ver Gráficos'}
              </button>
            </div>
          </Card.Header>

          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Tasa FED */}
              <div
                className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all cursor-pointer"
                onClick={() => setShowFredCharts(true)}
              >
                <p className="text-xs text-secondary mb-2">Tasa FED</p>
                <p className="text-2xl font-bold text-blue-400 tabular-nums">
                  {fredData.federalFundsRate?.latest.toFixed(2)}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {fredData.federalFundsRate && fredData.federalFundsRate.change !== 0 && (
                    <>
                      {fredData.federalFundsRate.change > 0 ? (
                        <FaArrowUp className="text-[10px] text-success" />
                      ) : (
                        <FaArrowDown className="text-[10px] text-error" />
                      )}
                      <span className="text-[10px] text-secondary">
                        {Math.abs(fredData.federalFundsRate.changePercent).toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-secondary mt-1">Fed Funds Rate</p>
              </div>

              {/* Inflación USA */}
              <div
                className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all cursor-pointer"
                onClick={() => setShowFredCharts(true)}
              >
                <p className="text-xs text-secondary mb-2">Inflación USA</p>
                <p className="text-2xl font-bold text-blue-400 tabular-nums">
                  {fredData.inflationCPI?.yearOverYear.toFixed(1)}%
                </p>
                <p className="text-[10px] text-secondary mt-3">CPI Year over Year</p>
              </div>

              {/* PIB */}
              <div
                className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all cursor-pointer"
                onClick={() => setShowFredCharts(true)}
              >
                <p className="text-xs text-secondary mb-2">PIB USA</p>
                <p className="text-2xl font-bold text-blue-400 tabular-nums">
                  {fredData.gdp?.quarterlyGrowth > 0 ? '+' : ''}
                  {fredData.gdp?.quarterlyGrowth.toFixed(1)}%
                </p>
                <p className="text-[10px] text-secondary mt-3">Crecimiento QoQ</p>
              </div>

              {/* Desempleo */}
              <div
                className="p-4 rounded-lg glass border border-border hover:border-blue-400/30 transition-all cursor-pointer"
                onClick={() => setShowFredCharts(true)}
              >
                <p className="text-xs text-secondary mb-2">Desempleo</p>
                <p className="text-2xl font-bold text-blue-400 tabular-nums">
                  {fredData.unemploymentRate?.latest.toFixed(1)}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {fredData.unemploymentRate && fredData.unemploymentRate.change !== 0 && (
                    <>
                      {fredData.unemploymentRate.change > 0 ? (
                        <FaArrowUp className="text-[10px] text-error" />
                      ) : (
                        <FaArrowDown className="text-[10px] text-success" />
                      )}
                      <span className="text-[10px] text-secondary">
                        {Math.abs(fredData.unemploymentRate.changePercent).toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-secondary mt-1">Tasa actual</p>
              </div>
            </div>

            {/* Gráficos Interactivos */}
            {showFredCharts && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-400" />
                  Evolución Histórica (últimos 12 meses)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tasa FED Chart */}
                  {fredData.federalFundsRate && fredData.federalFundsRate.data && (
                    <div className="p-4 rounded-lg glass border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-secondary flex-1">
                          <div className="mb-1">Tasa de Interés FED</div>
                          <span className="text-blue-400">
                            {fredData.federalFundsRate.latest.toFixed(2)}%
                          </span>
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChart('fred-rate');
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            favoriteChartIds.includes('fred-rate')
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                          }`}
                          aria-label={
                            favoriteChartIds.includes('fred-rate')
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos'
                          }
                        >
                          {favoriteChartIds.includes('fred-rate') ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="h-48">
                        <FredChart
                          data={fredData.federalFundsRate.data}
                          title="Tasa FED"
                          color="#3b82f6"
                          yAxisLabel="Tasa"
                          formatValue={(v) => `${v.toFixed(2)}%`}
                          showPoints={true}
                          monthsToShow={12}
                        />
                      </div>
                    </div>
                  )}

                  {/* Inflación Chart */}
                  {fredData.inflationCPI &&
                    fredData.inflationCPI.data &&
                    fredData.inflationCPI.latest && (
                      <div className="p-4 rounded-lg glass border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-semibold text-secondary flex-1">
                            <div className="mb-1">Índice de Precios (CPI)</div>
                            <span className="text-blue-400">
                              {fredData.inflationCPI.latest.toFixed(1)}
                            </span>
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChart('fred-cpi');
                            }}
                            className={`p-1.5 rounded-lg transition-all ${
                              favoriteChartIds.includes('fred-cpi')
                                ? 'bg-accent-emerald/20 text-accent-emerald'
                                : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                            }`}
                            aria-label={
                              favoriteChartIds.includes('fred-cpi')
                                ? 'Quitar de favoritos'
                                : 'Agregar a favoritos'
                            }
                          >
                            {favoriteChartIds.includes('fred-cpi') ? (
                              <FaStar className="text-sm" />
                            ) : (
                              <FaRegStar className="text-sm" />
                            )}
                          </button>
                        </div>
                        <div className="h-48">
                          <FredChart
                            data={fredData.inflationCPI.data}
                            title="CPI"
                            color="#8b5cf6"
                            yAxisLabel="Índice"
                            formatValue={(v) => v.toFixed(1)}
                            showPoints={true}
                            monthsToShow={12}
                          />
                        </div>
                      </div>
                    )}

                  {/* Desempleo Chart */}
                  {fredData.unemploymentRate && fredData.unemploymentRate.data && (
                    <div className="p-4 rounded-lg glass border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-secondary flex-1">
                          <div className="mb-1">Tasa de Desempleo</div>
                          <span className="text-blue-400">
                            {fredData.unemploymentRate.latest.toFixed(1)}%
                          </span>
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChart('fred-unemployment');
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            favoriteChartIds.includes('fred-unemployment')
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                          }`}
                          aria-label={
                            favoriteChartIds.includes('fred-unemployment')
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos'
                          }
                        >
                          {favoriteChartIds.includes('fred-unemployment') ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="h-48">
                        <FredChart
                          data={fredData.unemploymentRate.data}
                          title="Desempleo"
                          color="#10b981"
                          yAxisLabel="Tasa"
                          formatValue={(v) => `${v.toFixed(1)}%`}
                          showPoints={true}
                          monthsToShow={12}
                        />
                      </div>
                    </div>
                  )}

                  {/* Treasury 10Y Chart */}
                  {fredData.treasury10y && fredData.treasury10y.data && (
                    <div className="p-4 rounded-lg glass border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-secondary flex-1">
                          <div className="mb-1">Bonos del Tesoro 10 años</div>
                          <span className="text-blue-400">
                            {fredData.treasury10y.latest.toFixed(2)}%
                          </span>
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChart('fred-treasury');
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            favoriteChartIds.includes('fred-treasury')
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                          }`}
                          aria-label={
                            favoriteChartIds.includes('fred-treasury')
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos'
                          }
                        >
                          {favoriteChartIds.includes('fred-treasury') ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="h-48">
                        <FredChart
                          data={fredData.treasury10y.data}
                          title="Treasury 10Y"
                          color="#f59e0b"
                          yAxisLabel="Rendimiento"
                          formatValue={(v) => `${v.toFixed(2)}%`}
                          showPoints={true}
                          monthsToShow={12}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Footer */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs text-secondary">
                  <strong className="text-foreground">FRED</strong> (Federal Reserve Economic Data)
                  - Datos oficiales de la Reserva Federal.
                  {fredData.federalFundsRate?.lastUpdate && (
                    <span className="text-blue-400 ml-2">
                      Actualizado:{' '}
                      {new Date(fredData.federalFundsRate.lastUpdate).toLocaleDateString('es-AR')}
                    </span>
                  )}
                </p>
                <a
                  href="https://fred.stlouisfed.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold text-xs transition-all flex items-center gap-2"
                >
                  Explorar FRED →
                </a>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* ECB - Banco Central Europeo */}
      {!ecbLoading && ecbData && (
        <Card
          variant="elevated"
          padding="lg"
          className="mt-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20"
        >
          <Card.Header>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <FaGlobeAmericas className="text-xl text-indigo-400" />
                </div>
                <div>
                  <Card.Title className="mb-0">Tipos de Cambio Oficiales</Card.Title>
                  <p className="text-xs text-secondary mt-1">Banco Central Europeo (ECB)</p>
                </div>
              </div>
              <button
                onClick={() => setShowECBCharts(!showECBCharts)}
                className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FaChartLine />
                {showECBCharts ? 'Ocultar Gráficos' : 'Ver Gráficos'}
              </button>
            </div>
          </Card.Header>

          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* EUR/USD */}
              <div
                className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
                onClick={() => setShowECBCharts(true)}
              >
                <p className="text-xs text-secondary mb-2">EUR / USD</p>
                <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                  ${ecbData.rates.USD.toFixed(4)}
                </p>
                <p className="text-[10px] text-secondary mt-1">Dólar estadounidense</p>
              </div>

              {/* EUR/ARS */}
              {ecbData.rates.ARS && (
                <div
                  className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
                  onClick={() => setShowECBCharts(true)}
                >
                  <p className="text-xs text-secondary mb-2">EUR / ARS</p>
                  <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                    ${ecbData.rates.ARS.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-secondary mt-1">Peso argentino</p>
                </div>
              )}

              {/* EUR/GBP */}
              {ecbData.rates.GBP && (
                <div
                  className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
                  onClick={() => setShowECBCharts(true)}
                >
                  <p className="text-xs text-secondary mb-2">EUR / GBP</p>
                  <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                    ${ecbData.rates.GBP.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-secondary mt-1">Libra esterlina</p>
                </div>
              )}

              {/* EUR/JPY */}
              {ecbData.rates.JPY && (
                <div
                  className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
                  onClick={() => setShowECBCharts(true)}
                >
                  <p className="text-xs text-secondary mb-2">EUR / JPY</p>
                  <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                    ¥{ecbData.rates.JPY.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-secondary mt-1">Yen japonés</p>
                </div>
              )}

              {/* EUR/CHF */}
              {ecbData.rates.CHF && (
                <div
                  className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
                  onClick={() => setShowECBCharts(true)}
                >
                  <p className="text-xs text-secondary mb-2">EUR / CHF</p>
                  <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                    {ecbData.rates.CHF.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-secondary mt-1">Franco suizo</p>
                </div>
              )}

              {/* EUR/BRL */}
              {ecbData.rates.BRL && (
                <div
                  className="p-4 rounded-lg glass border border-border hover:border-indigo-400/30 transition-all cursor-pointer"
                  onClick={() => setShowECBCharts(true)}
                >
                  <p className="text-xs text-secondary mb-2">EUR / BRL</p>
                  <p className="text-2xl font-bold text-indigo-400 tabular-nums">
                    R${ecbData.rates.BRL.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-secondary mt-1">Real brasileño</p>
                </div>
              )}
            </div>

            {/* Gráficos Interactivos ECB */}
            {showECBCharts && !ecbHistoricalLoading && ecbHistorical && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FaChartLine className="text-indigo-400" />
                  Evolución Histórica (últimos 12 meses)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* EUR/USD Chart */}
                  {ecbHistorical.USD && ecbHistorical.USD.data && (
                    <div className="p-4 rounded-lg glass border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-secondary flex-1">
                          <div className="mb-1">EUR / USD</div>
                          <span className="text-indigo-400">
                            ${ecbHistorical.USD.latest.toFixed(4)}
                          </span>
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChart('ecb-usd');
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            favoriteChartIds.includes('ecb-usd')
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                          }`}
                          aria-label={
                            favoriteChartIds.includes('ecb-usd')
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos'
                          }
                        >
                          {favoriteChartIds.includes('ecb-usd') ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="h-48">
                        <FredChart
                          data={ecbHistorical.USD.data.map((d) => ({
                            date: d.date,
                            value: d.rate,
                          }))}
                          title="EUR/USD"
                          color="#6366f1"
                          yAxisLabel="Tipo de cambio"
                          formatValue={(v) => `$${v.toFixed(4)}`}
                          showPoints={true}
                          monthsToShow={12}
                        />
                      </div>
                    </div>
                  )}

                  {/* EUR/ARS Chart */}
                  {ecbHistorical.ARS && ecbHistorical.ARS.data && (
                    <div className="p-4 rounded-lg glass border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-secondary flex-1">
                          <div className="mb-1">EUR / ARS</div>
                          <span className="text-indigo-400">
                            ${ecbHistorical.ARS.latest.toFixed(2)}
                          </span>
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChart('ecb-ars');
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            favoriteChartIds.includes('ecb-ars')
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                          }`}
                          aria-label={
                            favoriteChartIds.includes('ecb-ars')
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos'
                          }
                        >
                          {favoriteChartIds.includes('ecb-ars') ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="h-48">
                        <FredChart
                          data={ecbHistorical.ARS.data.map((d) => ({
                            date: d.date,
                            value: d.rate,
                          }))}
                          title="EUR/ARS"
                          color="#8b5cf6"
                          yAxisLabel="Tipo de cambio"
                          formatValue={(v) => `$${v.toFixed(2)}`}
                          showPoints={true}
                          monthsToShow={12}
                        />
                      </div>
                    </div>
                  )}

                  {/* EUR/GBP Chart */}
                  {ecbHistorical.GBP && ecbHistorical.GBP.data && (
                    <div className="p-4 rounded-lg glass border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-secondary flex-1">
                          <div className="mb-1">EUR / GBP</div>
                          <span className="text-indigo-400">
                            ${ecbHistorical.GBP.latest.toFixed(4)}
                          </span>
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChart('ecb-gbp');
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            favoriteChartIds.includes('ecb-gbp')
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                          }`}
                          aria-label={
                            favoriteChartIds.includes('ecb-gbp')
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos'
                          }
                        >
                          {favoriteChartIds.includes('ecb-gbp') ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="h-48">
                        <FredChart
                          data={ecbHistorical.GBP.data.map((d) => ({
                            date: d.date,
                            value: d.rate,
                          }))}
                          title="EUR/GBP"
                          color="#10b981"
                          yAxisLabel="Tipo de cambio"
                          formatValue={(v) => `$${v.toFixed(4)}`}
                          showPoints={true}
                          monthsToShow={12}
                        />
                      </div>
                    </div>
                  )}

                  {/* EUR/BRL Chart */}
                  {ecbHistorical.BRL && ecbHistorical.BRL.data && (
                    <div className="p-4 rounded-lg glass border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-secondary flex-1">
                          <div className="mb-1">EUR / BRL</div>
                          <span className="text-indigo-400">
                            R${ecbHistorical.BRL.latest.toFixed(4)}
                          </span>
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChart('ecb-brl');
                          }}
                          className={`p-1.5 rounded-lg transition-all ${
                            favoriteChartIds.includes('ecb-brl')
                              ? 'bg-accent-emerald/20 text-accent-emerald'
                              : 'glass text-secondary hover:text-accent-emerald hover:bg-white/5'
                          }`}
                          aria-label={
                            favoriteChartIds.includes('ecb-brl')
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos'
                          }
                        >
                          {favoriteChartIds.includes('ecb-brl') ? (
                            <FaStar className="text-sm" />
                          ) : (
                            <FaRegStar className="text-sm" />
                          )}
                        </button>
                      </div>
                      <div className="h-48">
                        <FredChart
                          data={ecbHistorical.BRL.data.map((d) => ({
                            date: d.date,
                            value: d.rate,
                          }))}
                          title="EUR/BRL"
                          color="#f59e0b"
                          yAxisLabel="Tipo de cambio"
                          formatValue={(v) => `R$${v.toFixed(4)}`}
                          showPoints={true}
                          monthsToShow={12}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Footer */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs text-secondary">
                  <strong className="text-foreground">ECB</strong> (European Central Bank) - Tipos
                  de cambio de referencia del Euro.
                  {ecbData.date && (
                    <span className="text-indigo-400 ml-2">
                      Actualizado:{' '}
                      {new Date(ecbData.date).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </p>
                <a
                  href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-semibold text-xs transition-all flex items-center gap-2"
                >
                  Ver en ECB →
                </a>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Todos los Dólares - NUEVA TABLA PROFESIONAL */}
      <Card variant="elevated" padding="lg" className="mt-6">
        <Card.Header>
          <div className="flex items-center gap-3">
            <FaDollarSign className="text-accent-emerald text-xl" />
            <Card.Title className="mb-0">Todas las Cotizaciones del Dólar</Card.Title>
          </div>
        </Card.Header>

        <Card.Content>
          <DolaresTable
            dolares={dolares || []}
            isLoading={loadingDolares}
            favoriteDolarIds={favoriteDolarIds}
            onToggleFavorite={toggleDolar}
          />
        </Card.Content>
      </Card>

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </DashboardLayout>
  );
}
