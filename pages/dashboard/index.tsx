import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import {
  FaDollarSign,
  FaStar,
  FaChartLine,
  FaGlobeAmericas,
  FaArrowUp,
  FaArrowDown,
  FaRegStar,
} from 'react-icons/fa';

const STORAGE_KEY = 'dolargaucho_favorites';

interface Favorites {
  dolares: string[];
  currencies: string[];
}

export default function DashboardPage() {
  const { data: dolares, isLoading: loadingDolares } = useDolarQuery();
  const { data: cotizaciones, isLoading: loadingCotizaciones } = useCotizaciones();

  const [favorites, setFavorites] = useState<Favorites>({
    dolares: [],
    currencies: [],
  });

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Favorites) => {
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  };

  const toggleDolarFavorite = (casa: string) => {
    const newDolares = favorites.dolares.includes(casa)
      ? favorites.dolares.filter((f) => f !== casa)
      : [...favorites.dolares, casa];

    saveFavorites({ ...favorites, dolares: newDolares });
  };

  const toggleCurrencyFavorite = (moneda: string) => {
    const newCurrencies = favorites.currencies.includes(moneda)
      ? favorites.currencies.filter((f) => f !== moneda)
      : [...favorites.currencies, moneda];

    saveFavorites({ ...favorites, currencies: newCurrencies });
  };

  // Get featured dolares (Blue, MEP, CCL)
  const featuredDolares = dolares?.filter((d) =>
    ['blue', 'bolsa', 'contadoconliqui'].includes(d.casa)
  );

  const getTrend = () => {
    // Mock trend - in real app, compare with previous value
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    return trend;
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido! 👋</h1>
        <p className="text-secondary">Aquí está tu resumen del mercado cambiario argentino</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loadingDolares
          ? // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} variant="elevated" padding="lg">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/2 mb-4" />
                  <div className="h-8 bg-white/10 rounded w-3/4" />
                </div>
              </Card>
            ))
          : featuredDolares?.map((dolar) => {
              const trend = getTrend();
              const TrendIcon = trend === 'up' ? FaArrowUp : FaArrowDown;
              const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';

              return (
                <Card key={dolar.nombre} variant="elevated" padding="lg" hover="glow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-secondary uppercase tracking-wider">
                        {dolar.nombre}
                      </p>
                      <p className="text-3xl font-bold text-white mt-1">
                        ${dolar.venta.toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-3 glass rounded-xl ${trendColor}`}>
                      <TrendIcon className="text-xl" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Compra: ${dolar.compra.toFixed(2)}</span>
                    <button
                      onClick={() => toggleDolarFavorite(dolar.casa)}
                      className="text-accent-emerald hover:text-accent-teal transition-colors"
                    >
                      {favorites.dolares.includes(dolar.casa) ? <FaStar /> : <FaRegStar />}
                    </button>
                  </div>
                </Card>
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cotizaciones Internacionales */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>Cotizaciones Internacionales</Card.Title>
              <FaGlobeAmericas className="text-accent-emerald text-xl" />
            </div>
          </Card.Header>

          <Card.Content>
            {loadingCotizaciones ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {cotizaciones?.map((cotizacion) => (
                  <div
                    key={cotizacion.moneda}
                    className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center">
                        <span className="text-accent-emerald font-bold text-sm">
                          {cotizacion.moneda}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{cotizacion.nombre}</p>
                        <p className="text-xs text-secondary">{cotizacion.casa}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-semibold">${cotizacion.venta.toFixed(2)}</p>
                        <p className="text-xs text-secondary">
                          Compra: ${cotizacion.compra.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCurrencyFavorite(cotizacion.moneda)}
                        className="text-accent-emerald hover:text-accent-teal transition-colors"
                      >
                        {favorites.currencies.includes(cotizacion.moneda) ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated" padding="lg">
          <Card.Header>
            <Card.Title>Acciones Rápidas</Card.Title>
          </Card.Header>

          <Card.Content>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => (window.location.href = '/dashboard/favoritos')}
              >
                <FaStar className="mr-2" />
                Ver Favoritos
              </Button>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => (window.location.href = '/dashboard/calculadoras')}
              >
                <FaDollarSign className="mr-2" />
                Calculadoras
              </Button>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => (window.location.href = '/dashboard/analisis')}
              >
                <FaChartLine className="mr-2" />
                Análisis
              </Button>
            </div>
          </Card.Content>

          <Card.Footer>
            <div className="p-4 glass rounded-lg border border-accent-emerald/20 mt-4">
              <p className="text-xs text-secondary mb-2">💡 Tip del día</p>
              <p className="text-sm text-white">
                Agregá tus cotizaciones favoritas para un acceso rápido desde el dashboard.
              </p>
            </div>
          </Card.Footer>
        </Card>
      </div>

      {/* Todos los Dólares */}
      <Card variant="elevated" padding="lg" className="mt-6">
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>Todas las Cotizaciones del Dólar</Card.Title>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = '/')}>
              Ver tabla completa →
            </Button>
          </div>
        </Card.Header>

        <Card.Content>
          {loadingDolares ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse glass p-4 rounded-lg">
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
                  <div className="h-6 bg-white/10 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dolares?.map((dolar) => (
                <div
                  key={dolar.nombre}
                  className="glass p-4 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-secondary">{dolar.nombre}</p>
                    <button
                      onClick={() => toggleDolarFavorite(dolar.casa)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-emerald hover:text-accent-teal"
                    >
                      {favorites.dolares.includes(dolar.casa) ? (
                        <FaStar className="text-xs" />
                      ) : (
                        <FaRegStar className="text-xs" />
                      )}
                    </button>
                  </div>
                  <p className="text-xl font-bold text-white">${dolar.venta.toFixed(2)}</p>
                  <p className="text-xs text-secondary mt-1">Compra: ${dolar.compra.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </DashboardLayout>
  );
}
