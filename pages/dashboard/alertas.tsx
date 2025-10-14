import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { AlertForm } from '@/components/alertas/AlertForm';
import { AlertsList } from '@/components/alertas/AlertsList';
import { useAlertas } from '@/hooks/useAlertas';
import { FaBell, FaCheckCircle, FaPause, FaChartLine } from 'react-icons/fa';

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-emerald mx-auto mb-4"></div>
            <p className="text-secondary">Cargando alertas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                Total Alertas
              </div>
              <div className="text-3xl font-bold text-foreground">{estadisticas.total}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaBell className="text-accent-emerald text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">Activas</div>
              <div className="text-3xl font-bold text-foreground">{estadisticas.activas}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaChartLine className="text-accent-teal text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">Disparadas</div>
              <div className="text-3xl font-bold text-foreground">{estadisticas.disparadas}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaCheckCircle className="text-accent-emerald text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">Pausadas</div>
              <div className="text-3xl font-bold text-foreground">{estadisticas.pausadas}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaPause className="text-secondary text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alertas Recientes Disparadas */}
      {alertasRecientesDisparadas.length > 0 && (
        <Card variant="elevated" padding="lg" className="mb-8 border-2 border-accent-emerald">
          <Card.Header>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-accent-emerald text-xl" />
              <Card.Title>Alertas Recientes (Últimas 24h)</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-2">
              {alertasRecientesDisparadas.map((alerta) => (
                <div
                  key={alerta.id}
                  className="p-3 glass rounded-lg border border-accent-emerald/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground font-semibold">{alerta.nombre}</p>
                      <p className="text-sm text-secondary">
                        {alerta.fechaDisparada &&
                          new Date(alerta.fechaDisparada).toLocaleString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </p>
                    </div>
                    <div className="text-accent-emerald font-semibold">
                      ${getValorActual(alerta)?.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Formulario de creación */}
      <div className="mb-8">
        <AlertForm onCrear={crearAlerta} />
      </div>

      {/* Filtros */}
      {alertas.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-secondary text-sm font-medium">Filtrar:</span>
          <div className="flex gap-2">
            {[
              { key: 'todas', label: 'Todas' },
              { key: 'activas', label: 'Activas' },
              { key: 'disparadas', label: 'Disparadas' },
              { key: 'pausadas', label: 'Pausadas' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key as 'todas' | 'activas' | 'disparadas' | 'pausadas')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filtro === f.key
                    ? 'bg-accent-emerald text-background'
                    : 'glass text-secondary hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de alertas */}
      <AlertsList
        alertas={alertasFiltradas}
        onEliminar={eliminarAlerta}
        onToggle={toggleAlerta}
        getValorActual={getValorActual}
      />

      {/* Info Footer */}
      <Card variant="elevated" padding="lg" className="mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 glass rounded-xl">
            <FaBell className="text-accent-emerald text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground font-semibold mb-2">Cómo funcionan las Alertas</h3>
            <div className="text-secondary text-sm space-y-2">
              <p>
                • Las alertas se verifican automáticamente cada{' '}
                <strong className="text-foreground">30 segundos</strong>
              </p>
              <p>• Cuando una alerta se dispara, cambia su estado y se muestra destacada</p>
              <p>• Podés pausar/reactivar alertas sin eliminarlas</p>
              <p>• Los datos se guardan en tu navegador (localStorage)</p>
              <p className="text-warning">
                ⚠️ <strong>Nota:</strong> En esta versión las notificaciones son solo visuales. Las
                notificaciones push llegarán en una próxima actualización.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
