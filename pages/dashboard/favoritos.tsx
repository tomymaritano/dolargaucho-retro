import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { useDolarVariations } from '@/hooks/useDolarVariations';
import { useCotizacionesWithVariations } from '@/hooks/useCotizaciones';
import { FaStar, FaRegStar, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { useFavoritesStore } from '@/lib/store/favorites';
import Toast, { ToastType } from '@/components/Toast';

export default function FavoritosPage() {
  const { data: dolares } = useDolarVariations();
  const { data: cotizaciones } = useCotizacionesWithVariations();

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');

  // Get state and actions from Zustand store
  const {
    dolares: favoriteDolares,
    currencies: favoriteCurrencies,
    toggleDolar,
    toggleCurrency,
  } = useFavoritesStore();

  const showToast = (message: string, type: ToastType = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleToggleDolar = (casa: string) => {
    const result = toggleDolar(casa);
    showToast(result.message, result.success ? 'success' : 'info');
  };

  const handleToggleCurrency = (moneda: string) => {
    const result = toggleCurrency(moneda);
    showToast(result.message, result.success ? 'success' : 'info');
  };

  const favoriteDolaresData = React.useMemo(
    () => dolares?.filter((d) => favoriteDolares.includes(d.casa)),
    [dolares, favoriteDolares]
  );

  const favoriteCotizacionesData = React.useMemo(
    () => cotizaciones?.filter((c) => favoriteCurrencies.includes(c.moneda)),
    [cotizaciones, favoriteCurrencies]
  );

  const hasFavorites = React.useMemo(
    () => favoriteDolares.length > 0 || favoriteCurrencies.length > 0,
    [favoriteDolares.length, favoriteCurrencies.length]
  );

  return (
    <>
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        duration={3000}
      />
      <DashboardLayout>
        {!hasFavorites ? (
          <Card variant="elevated" padding="lg">
            <div className="text-center py-12">
              <FaRegStar className="text-6xl text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                No tenés favoritos guardados
              </h3>
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
              <Card variant="elevated" padding="none">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground">Dólares Favoritos</h2>
                  <p className="text-sm text-secondary mt-1">
                    {favoriteDolaresData.length}{' '}
                    {favoriteDolaresData.length === 1 ? 'favorito' : 'favoritos'}
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
                        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                          Compra
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                          Venta
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                          Variación
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {favoriteDolaresData.map((dolar) => {
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
                            key={dolar.casa}
                            className="border-b border-border hover:bg-white/5 transition-colors"
                          >
                            {/* Favorito */}
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleToggleDolar(dolar.casa)}
                                className="p-2 rounded-lg text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 transition-all"
                                aria-label={`Quitar ${dolar.nombre} de favoritos`}
                              >
                                <FaStar className="text-base" />
                              </button>
                            </td>

                            {/* Nombre */}
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {dolar.nombre}
                                </p>
                                <p className="text-xs text-secondary">{dolar.casa}</p>
                              </div>
                            </td>

                            {/* Compra */}
                            <td className="py-4 px-4 text-right">
                              <span className="text-sm font-semibold text-foreground tabular-nums">
                                ${dolar.compra.toFixed(2)}
                              </span>
                            </td>

                            {/* Venta */}
                            <td className="py-4 px-4 text-right">
                              <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                                ${dolar.venta.toFixed(2)}
                              </span>
                            </td>

                            {/* Variación */}
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
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Favorite Currencies */}
            {favoriteCotizacionesData && favoriteCotizacionesData.length > 0 && (
              <Card variant="elevated" padding="none">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground">Monedas Favoritas</h2>
                  <p className="text-sm text-secondary mt-1">
                    {favoriteCotizacionesData.length}{' '}
                    {favoriteCotizacionesData.length === 1 ? 'favorito' : 'favoritos'}
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
                          Moneda
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                          Compra
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                          Venta
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                          Variación
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {favoriteCotizacionesData.map((cotizacion) => {
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
                            key={cotizacion.moneda}
                            className="border-b border-border hover:bg-white/5 transition-colors"
                          >
                            {/* Favorito */}
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleToggleCurrency(cotizacion.moneda)}
                                className="p-2 rounded-lg text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 transition-all"
                                aria-label={`Quitar ${cotizacion.nombre} de favoritos`}
                              >
                                <FaStar className="text-base" />
                              </button>
                            </td>

                            {/* Nombre */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-accent-emerald font-bold text-sm">
                                    {cotizacion.moneda}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {cotizacion.nombre}
                                  </p>
                                  <p className="text-xs text-secondary">{cotizacion.casa}</p>
                                </div>
                              </div>
                            </td>

                            {/* Compra */}
                            <td className="py-4 px-4 text-right">
                              <span className="text-sm font-semibold text-foreground tabular-nums">
                                ${cotizacion.compra.toFixed(2)}
                              </span>
                            </td>

                            {/* Venta */}
                            <td className="py-4 px-4 text-right">
                              <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                                ${cotizacion.venta.toFixed(2)}
                              </span>
                            </td>

                            {/* Variación */}
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
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Add More Section - Dolares */}
        <Card variant="elevated" padding="none" className="mt-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Dólares Disponibles</h2>
            <p className="text-sm text-secondary mt-1">Agregá o quitá dólares de tus favoritos</p>
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
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Compra
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Venta
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Variación
                  </th>
                </tr>
              </thead>
              <tbody>
                {dolares?.map((dolar) => {
                  const isFavorite = favoriteDolares.includes(dolar.casa);
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
                      key={dolar.casa}
                      className={`border-b border-border hover:bg-white/5 transition-colors ${isFavorite ? 'bg-accent-emerald/5' : ''}`}
                    >
                      {/* Favorito Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleDolar(dolar.casa)}
                          className={`p-2 rounded-lg transition-all ${
                            isFavorite
                              ? 'text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20'
                              : 'text-secondary bg-secondary/10 hover:bg-secondary/20 hover:text-accent-emerald'
                          }`}
                          aria-label={
                            isFavorite
                              ? `Quitar ${dolar.nombre} de favoritos`
                              : `Agregar ${dolar.nombre} a favoritos`
                          }
                          aria-pressed={isFavorite}
                        >
                          {isFavorite ? (
                            <FaStar className="text-base" />
                          ) : (
                            <FaRegStar className="text-base" />
                          )}
                        </button>
                      </td>

                      {/* Nombre */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{dolar.nombre}</p>
                          <p className="text-xs text-secondary">{dolar.casa}</p>
                        </div>
                      </td>

                      {/* Compra */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          ${dolar.compra.toFixed(2)}
                        </span>
                      </td>

                      {/* Venta */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                          ${dolar.venta.toFixed(2)}
                        </span>
                      </td>

                      {/* Variación */}
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
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add More Section - Currencies */}
        <Card variant="elevated" padding="none" className="mt-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Monedas Internacionales</h2>
            <p className="text-sm text-secondary mt-1">Agregá o quitá monedas de tus favoritos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-center py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider w-12">
                    <FaStar className="inline-block text-accent-emerald" />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Moneda
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Compra
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Venta
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">
                    Variación
                  </th>
                </tr>
              </thead>
              <tbody>
                {cotizaciones?.map((cotizacion) => {
                  const isFavorite = favoriteCurrencies.includes(cotizacion.moneda);
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
                      key={cotizacion.moneda}
                      className={`border-b border-border hover:bg-white/5 transition-colors ${isFavorite ? 'bg-accent-emerald/5' : ''}`}
                    >
                      {/* Favorito Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleCurrency(cotizacion.moneda)}
                          className={`p-2 rounded-lg transition-all ${
                            isFavorite
                              ? 'text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20'
                              : 'text-secondary bg-secondary/10 hover:bg-secondary/20 hover:text-accent-emerald'
                          }`}
                          aria-label={
                            isFavorite
                              ? `Quitar ${cotizacion.nombre} de favoritos`
                              : `Agregar ${cotizacion.nombre} a favoritos`
                          }
                          aria-pressed={isFavorite}
                        >
                          {isFavorite ? (
                            <FaStar className="text-base" />
                          ) : (
                            <FaRegStar className="text-base" />
                          )}
                        </button>
                      </td>

                      {/* Nombre */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-accent-emerald font-bold text-sm">
                              {cotizacion.moneda}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {cotizacion.nombre}
                            </p>
                            <p className="text-xs text-secondary">{cotizacion.casa}</p>
                          </div>
                        </div>
                      </td>

                      {/* Compra */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          ${cotizacion.compra.toFixed(2)}
                        </span>
                      </td>

                      {/* Venta */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-accent-emerald tabular-nums">
                          ${cotizacion.venta.toFixed(2)}
                        </span>
                      </td>

                      {/* Variación */}
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
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </DashboardLayout>
    </>
  );
}
