import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { AlertForm } from '@/components/alertas/AlertForm';
import { AlertsList } from '@/components/alertas/AlertsList';
import { QuickAlerts } from '@/components/alertas/QuickAlerts';
import { useAlertas } from '@/hooks/useAlertas';
import { FaBell, FaCheckCircle, FaPause, FaChartLine, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button/Button';

export default function AlertasPage() {
  const {
    alertas,
    loading,
    estadisticas,
    alertasRecientesDisparadas,
    crearAlerta,
    eliminarAlerta,
    toggleAlerta,
    getValorActual,
  } = useAlertas();

  const [filtro, setFiltro] = useState<'todas' | 'activas' | 'disparadas' | 'pausadas'>('todas');
  const [showForm, setShowForm] = useState(false);

  const alertasFiltradas = React.useMemo(() => {
    switch (filtro) {
      case 'activas':
        return alertas.filter((a) => a.estado === 'activa');
      case 'disparadas':
        return alertas.filter((a) => a.estado === 'disparada');
      case 'pausadas':
        return alertas.filter((a) => a.estado === 'pausada');
      default:
        return alertas;
    }
  }, [alertas, filtro]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-secondary">Cargando alertas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          icon={FaBell}
          title="Mis Alertas"
          description="Recibe notificaciones cuando las cotizaciones alcancen los valores que te interesan"
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
              className="gap-2"
            >
              <FaPlus />
              {showForm ? 'Cancelar' : 'Personalizada'}
            </Button>
          }
        />

        {/* Formulario de creación (condicional) */}
        {showForm && (
          <AlertForm
            onCrear={(alerta) => {
              crearAlerta(alerta);
              setShowForm(false);
            }}
            defaultExpanded={showForm}
          />
        )}

        {/* Empty State - Si no hay alertas */}
        {alertas.length === 0 ? (
          <>
            {/* Quick Alerts cuando no hay alertas */}
            <QuickAlerts
              onCreateAlert={(alert) => {
                crearAlerta(alert);
              }}
            />

            <EmptyState
              icon={FaBell}
              title="No tienes alertas"
              description="Comenza creando una alerta rápida arriba, o crea una personalizada con el botón"
              actionLabel="Crear Alerta Personalizada"
              onAction={() => setShowForm(true)}
            />
          </>
        ) : (
          <>
            {/* Quick Alerts para crear alertas rápidas */}
            {!showForm && (
              <QuickAlerts
                onCreateAlert={(alert) => {
                  crearAlerta(alert);
                }}
              />
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="elevated" padding="md" hover="glow" className="border border-border/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-secondary text-xs mb-1 uppercase tracking-wider font-medium">
                      Total
                    </div>
                    <div className="text-2xl font-bold text-foreground">{estadisticas.total}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-brand/10">
                    <FaBell className="text-brand text-lg" />
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="md" hover="glow" className="border border-border/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-secondary text-xs mb-1 uppercase tracking-wider font-medium">
                      Activas
                    </div>
                    <div className="text-2xl font-bold text-foreground">{estadisticas.activas}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-green-500/10">
                    <FaChartLine className="text-green-500 text-lg" />
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="md" hover="glow" className="border border-border/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-secondary text-xs mb-1 uppercase tracking-wider font-medium">
                      Disparadas
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {estadisticas.disparadas}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-brand/10">
                    <FaCheckCircle className="text-brand text-lg" />
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="md" hover="glow" className="border border-border/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-secondary text-xs mb-1 uppercase tracking-wider font-medium">
                      Pausadas
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {estadisticas.pausadas}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-panel/10">
                    <FaPause className="text-secondary text-lg" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Alertas Recientes Disparadas */}
            {alertasRecientesDisparadas.length > 0 && (
              <Card variant="elevated" padding="md" className="border-2 border-brand/50 bg-brand/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-brand/20">
                    <FaCheckCircle className="text-brand text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Alertas Recientes (24h)
                    </h3>
                    <p className="text-xs text-secondary">
                      {alertasRecientesDisparadas.length} alerta
                      {alertasRecientesDisparadas.length !== 1 ? 's' : ''} disparada
                      {alertasRecientesDisparadas.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {alertasRecientesDisparadas.map((alerta) => (
                    <div
                      key={alerta.id}
                      className="p-3 rounded-lg border border-brand/30 bg-panel/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-semibold text-sm truncate">
                            {alerta.nombre}
                          </p>
                          <p className="text-xs text-secondary">
                            {alerta.fechaDisparada &&
                              new Date(alerta.fechaDisparada).toLocaleString('es-AR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                          </p>
                        </div>
                        <div className="text-brand font-bold text-sm ml-2">
                          ${getValorActual(alerta)?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Filtros */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Mis Alertas ({alertasFiltradas.length})
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: 'todas', label: 'Todas', count: alertas.length },
                  { key: 'activas', label: 'Activas', count: estadisticas.activas },
                  { key: 'disparadas', label: 'Disparadas', count: estadisticas.disparadas },
                  { key: 'pausadas', label: 'Pausadas', count: estadisticas.pausadas },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() =>
                      setFiltro(f.key as 'todas' | 'activas' | 'disparadas' | 'pausadas')
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      filtro === f.key
                        ? 'bg-brand text-background-dark border-brand'
                        : 'bg-panel border-border text-secondary hover:text-foreground hover:border-brand/30'
                    }`}
                  >
                    {f.label} {f.count > 0 && `(${f.count})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de alertas */}
            <AlertsList
              alertas={alertasFiltradas}
              onEliminar={eliminarAlerta}
              onToggle={toggleAlerta}
              getValorActual={getValorActual}
            />

            {/* Info Footer */}
            <Card variant="solid" padding="md" className="border border-brand/20 bg-brand/5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand/10 flex-shrink-0">
                  <FaInfoCircle className="text-brand text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-semibold text-sm mb-2">
                    Cómo funcionan las Alertas
                  </h3>
                  <div className="text-secondary text-xs space-y-1.5">
                    <p>
                      • Verificación automática cada{' '}
                      <strong className="text-foreground">30 segundos</strong>
                    </p>
                    <p>• Cambio de estado visual cuando se disparan</p>
                    <p>• Pausar/reactivar sin eliminar</p>
                    <p>• Guardado en tu navegador (localStorage)</p>
                    <p className="text-warning text-xs">⚠️ Notificaciones push próximamente</p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
