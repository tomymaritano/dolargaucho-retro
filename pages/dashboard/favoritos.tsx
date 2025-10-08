import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { useDolarQuery } from '@/hooks/useDolarQuery';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';
import { useFavoritesStore } from '@/lib/store/favorites';

export default function FavoritosPage() {
  const { data: dolares } = useDolarQuery();
  const { data: cotizaciones } = useCotizaciones();

  // Get state and actions from Zustand store
  const {
    dolares: favoriteDolares,
    currencies: favoriteCurrencies,
    toggleDolar,
    toggleCurrency,
  } = useFavoritesStore();

  const favoriteDolaresData = dolares?.filter((d) => favoriteDolares.includes(d.casa));
  const favoriteCotizacionesData = cotizaciones?.filter((c) =>
    favoriteCurrencies.includes(c.moneda)
  );

  const hasFavorites = favoriteDolares.length > 0 || favoriteCurrencies.length > 0;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">⭐ Mis Favoritos</h1>
        <p className="text-secondary">Accedé rápidamente a tus cotizaciones favoritas</p>
      </div>

      {!hasFavorites ? (
        <Card variant="elevated" padding="lg">
          <div className="text-center py-12">
            <FaRegStar className="text-6xl text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No tenés favoritos guardados</h3>
            <p className="text-secondary mb-6">
              Empezá agregando tus cotizaciones favoritas para un acceso rápido
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => (window.location.href = '/dashboard')}
            >
              Ir al Dashboard
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Favorite Dolares */}
          {favoriteDolaresData && favoriteDolaresData.length > 0 && (
            <Card variant="elevated" padding="lg">
              <Card.Header>
                <Card.Title>Dólares Favoritos</Card.Title>
              </Card.Header>

              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteDolaresData.map((dolar) => (
                    <div
                      key={dolar.casa}
                      className="glass p-6 rounded-xl border border-accent-emerald/20 relative group"
                    >
                      <button
                        onClick={() => toggleDolar(dolar.casa)}
                        className="absolute top-4 right-4 text-accent-emerald hover:text-error transition-colors"
                      >
                        <FaTimes className="text-lg" />
                      </button>

                      <p className="text-sm text-secondary uppercase tracking-wider mb-2">
                        {dolar.nombre}
                      </p>
                      <p className="text-3xl font-bold text-white mb-4">
                        ${dolar.venta.toFixed(2)}
                      </p>

                      <div className="flex justify-between text-sm">
                        <span className="text-secondary">Compra</span>
                        <span className="text-white font-semibold">${dolar.compra.toFixed(2)}</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-secondary">
                          {new Date(dolar.fechaActualizacion).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Favorite Currencies */}
          {favoriteCotizacionesData && favoriteCotizacionesData.length > 0 && (
            <Card variant="elevated" padding="lg">
              <Card.Header>
                <Card.Title>Monedas Favoritas</Card.Title>
              </Card.Header>

              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteCotizacionesData.map((cotizacion) => (
                    <div
                      key={cotizacion.moneda}
                      className="glass p-6 rounded-xl border border-accent-emerald/20 relative group"
                    >
                      <button
                        onClick={() => toggleCurrency(cotizacion.moneda)}
                        className="absolute top-4 right-4 text-accent-emerald hover:text-error transition-colors"
                      >
                        <FaTimes className="text-lg" />
                      </button>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center">
                          <span className="text-accent-emerald font-bold text-sm">
                            {cotizacion.moneda}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{cotizacion.nombre}</p>
                          <p className="text-xs text-secondary">{cotizacion.casa}</p>
                        </div>
                      </div>

                      <p className="text-2xl font-bold text-white mb-4">
                        ${cotizacion.venta.toFixed(2)}
                      </p>

                      <div className="flex justify-between text-sm">
                        <span className="text-secondary">Compra</span>
                        <span className="text-white font-semibold">
                          ${cotizacion.compra.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      )}

      {/* Add More Section */}
      <Card variant="elevated" padding="lg" className="mt-8">
        <Card.Header>
          <Card.Title>Agregar más favoritos</Card.Title>
        </Card.Header>

        <Card.Content>
          <div className="space-y-6">
            {/* Dolares */}
            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                Dólares Disponibles
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {dolares?.map((dolar) => {
                  const isFavorite = favoriteDolares.includes(dolar.casa);
                  return (
                    <button
                      key={dolar.casa}
                      onClick={() => toggleDolar(dolar.casa)}
                      className={`glass p-4 rounded-lg text-left transition-all ${
                        isFavorite
                          ? 'border-2 border-accent-emerald bg-accent-emerald/10'
                          : 'border border-white/10 hover:border-accent-emerald/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white font-medium">{dolar.nombre}</span>
                        {isFavorite ? (
                          <FaStar className="text-accent-emerald" />
                        ) : (
                          <FaRegStar className="text-secondary" />
                        )}
                      </div>
                      <span className="text-lg font-bold text-white">
                        ${dolar.venta.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currencies */}
            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                Monedas Internacionales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cotizaciones?.map((cotizacion) => {
                  const isFavorite = favoriteCurrencies.includes(cotizacion.moneda);
                  return (
                    <button
                      key={cotizacion.moneda}
                      onClick={() => toggleCurrency(cotizacion.moneda)}
                      className={`glass p-4 rounded-lg text-left transition-all ${
                        isFavorite
                          ? 'border-2 border-accent-emerald bg-accent-emerald/10'
                          : 'border border-white/10 hover:border-accent-emerald/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white font-medium">
                          {cotizacion.moneda} - {cotizacion.nombre}
                        </span>
                        {isFavorite ? (
                          <FaStar className="text-accent-emerald" />
                        ) : (
                          <FaRegStar className="text-secondary" />
                        )}
                      </div>
                      <span className="text-lg font-bold text-white">
                        ${cotizacion.venta.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </DashboardLayout>
  );
}
