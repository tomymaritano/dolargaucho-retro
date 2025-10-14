import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/Card/Card';
import { CalendarioMensual } from '@/components/calendario/CalendarioMensual';
import { ProximosEventos } from '@/components/calendario/ProximosEventos';
import { useFeriadosActuales, useEventosPresidenciales } from '@/hooks/useEventos';
import type { Feriado, EventoPresidencial } from '@/types/api/argentina';
import { FaCalendarAlt, FaCalendarDay, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

export default function CalendarioPage() {
  const hoy = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth());
  const [añoSeleccionado, setAñoSeleccionado] = useState(hoy.getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState<{
    fecha: Date;
    feriados: Feriado[];
    eventos: EventoPresidencial[];
  } | null>(null);

  const { data: feriados, isLoading: loadingFeriados } = useFeriadosActuales();
  const { data: eventos, isLoading: loadingEventos } = useEventosPresidenciales();

  const isLoading = loadingFeriados || loadingEventos;

  // Filtrar feriados y eventos del mes seleccionado
  const feriadosDelMes = React.useMemo(() => {
    if (!feriados) return [];
    return feriados.filter((f) => {
      const fecha = new Date(f.fecha);
      return fecha.getMonth() === mesSeleccionado && fecha.getFullYear() === añoSeleccionado;
    });
  }, [feriados, mesSeleccionado, añoSeleccionado]);

  const eventosDelMes = React.useMemo(() => {
    if (!eventos) return [];
    return eventos.filter((e) => {
      const fecha = new Date(e.fecha);
      return fecha.getMonth() === mesSeleccionado && fecha.getFullYear() === añoSeleccionado;
    });
  }, [eventos, mesSeleccionado, añoSeleccionado]);

  // Estadísticas generales
  const stats = React.useMemo(() => {
    const totalFeriados = feriados?.length || 0;
    const totalEventos = eventos?.length || 0;

    const feriadosProximos =
      feriados?.filter((f) => {
        const fecha = new Date(f.fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return fecha >= hoy;
      }).length || 0;

    return {
      totalFeriados,
      totalEventos,
      feriadosProximos,
      totalCombinado: totalFeriados + totalEventos,
    };
  }, [feriados, eventos]);

  const handleMesChange = (mes: number, año: number) => {
    setMesSeleccionado(mes);
    setAñoSeleccionado(año);
    setDiaSeleccionado(null); // Reset día seleccionado
  };

  const handleDiaClick = (
    fecha: Date,
    feriadosDelDia: Feriado[],
    eventosDelDia: EventoPresidencial[]
  ) => {
    setDiaSeleccionado({ fecha, feriados: feriadosDelDia, eventos: eventosDelDia });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-accent-emerald mx-auto mb-4" />
            <p className="text-secondary">Cargando calendario...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Calendario de Eventos</h1>
        <p className="text-secondary">Feriados nacionales y eventos presidenciales de Argentina</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                Total Eventos
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalCombinado}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaCalendarAlt className="text-accent-emerald text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                Feriados {añoSeleccionado}
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalFeriados}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaCalendarDay className="text-accent-emerald text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                Feriados Próximos
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.feriadosProximos}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaCalendarDay className="text-accent-teal text-xl" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" hover="glow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-secondary text-sm mb-1 uppercase tracking-wider">
                Eventos Presidenciales
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalEventos}</div>
            </div>
            <div className="p-3 glass rounded-xl">
              <FaMapMarkerAlt className="text-accent-teal text-xl" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <CalendarioMensual
            mes={mesSeleccionado}
            año={añoSeleccionado}
            feriados={feriadosDelMes}
            eventos={eventosDelMes}
            onMesChange={handleMesChange}
            onDiaClick={handleDiaClick}
          />

          {/* Detalle del día seleccionado */}
          {diaSeleccionado &&
            (diaSeleccionado.feriados.length > 0 || diaSeleccionado.eventos.length > 0) && (
              <Card variant="elevated" padding="lg" className="mt-6">
                <Card.Header>
                  <Card.Title>
                    {diaSeleccionado.fecha.toLocaleDateString('es-AR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Card.Title>
                </Card.Header>

                <Card.Content>
                  <div className="space-y-4">
                    {diaSeleccionado.feriados.map((feriado) => (
                      <div
                        key={feriado.fecha}
                        className="p-4 bg-accent-emerald/10 border border-accent-emerald/30 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-accent-emerald/20 rounded-lg">
                            <FaCalendarDay className="text-accent-emerald" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-foreground font-semibold mb-1">{feriado.nombre}</h4>
                            <p className="text-sm text-secondary mb-2">{feriado.tipo}</p>
                            {feriado.info && (
                              <p className="text-sm text-foreground/80">{feriado.info}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {diaSeleccionado.eventos.map((evento, index) => (
                      <div
                        key={`${evento.fecha}-${index}`}
                        className="p-4 glass rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-accent-teal/20 rounded-lg">
                            <FaMapMarkerAlt className="text-accent-teal" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-foreground font-semibold mb-1">{evento.descripcion}</h4>
                            <div className="space-y-1 text-sm text-secondary">
                              <p>
                                <strong>Tipo:</strong> {evento.tipo}
                              </p>
                              <p>
                                <strong>Presidente:</strong> {evento.presidente}
                              </p>
                              {evento.ubicacion && (
                                <p>
                                  <strong>Ubicación:</strong> {evento.ubicacion}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            )}
        </div>

        {/* Próximos eventos */}
        <div>
          <ProximosEventos feriados={feriados || []} eventos={eventos || []} limit={8} />
        </div>
      </div>

      {/* Info Footer */}
      <Card variant="elevated" padding="lg" className="mt-8">
        <div className="flex items-start gap-4">
          <div className="p-3 glass rounded-xl">
            <FaCalendarAlt className="text-accent-emerald text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground font-semibold mb-2">Fuente de Datos</h3>
            <p className="text-secondary text-sm mb-3">
              Los feriados y eventos presidenciales provienen de{' '}
              <a
                href="https://argentinadatos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-emerald hover:text-accent-teal transition-colors"
              >
                ArgentinaData API
              </a>
              , una fuente oficial de información argentina.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-secondary">
              <div>
                <span className="text-foreground font-semibold">Actualización:</span> Diaria
              </div>
              <div>
                <span className="text-foreground font-semibold">Fuente:</span> Gobierno de Argentina
              </div>
              <div>
                <span className="text-foreground font-semibold">Cache:</span> 24 horas
              </div>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
