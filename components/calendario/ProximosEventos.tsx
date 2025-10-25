import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import type { Feriado, EventoPresidencial } from '@/types/api/argentina';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface ProximosEventosProps {
  feriados: Feriado[];
  eventos: EventoPresidencial[];
  limit?: number;
}

type EventoCombinado = {
  tipo: 'feriado' | 'evento';
  fecha: string;
  titulo: string;
  subtitulo?: string;
  ubicacion?: string;
  data: Feriado | EventoPresidencial;
};

export function ProximosEventos({ feriados, eventos, limit = 10 }: ProximosEventosProps) {
  const eventosCombinados = React.useMemo<EventoCombinado[]>(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const feriadosMapeados: EventoCombinado[] = feriados
      .filter((f) => new Date(f.fecha) >= hoy)
      .map((f) => ({
        tipo: 'feriado' as const,
        fecha: f.fecha,
        titulo: f.nombre,
        subtitulo: f.tipo,
        data: f,
      }));

    const eventosMapeados: EventoCombinado[] = eventos
      .filter((e) => new Date(e.fecha) >= hoy)
      .map((e) => ({
        tipo: 'evento' as const,
        fecha: e.fecha,
        titulo: e.descripcion,
        subtitulo: `${e.tipo} - ${e.presidente}`,
        ubicacion: e.ubicacion,
        data: e,
      }));

    return [...feriadosMapeados, ...eventosMapeados]
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(0, limit);
  }, [feriados, eventos, limit]);

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    // Resetear horas para comparación
    hoy.setHours(0, 0, 0, 0);
    mañana.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    if (fecha.getTime() === hoy.getTime()) {
      return 'Hoy';
    } else if (fecha.getTime() === mañana.getTime()) {
      return 'Mañana';
    }

    return fecha.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const getDiasRestantes = (fechaStr: string) => {
    const hoy = new Date();
    const fecha = new Date(fechaStr);
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    if (diff < 7) return `En ${diff} días`;
    if (diff < 30) return `En ${Math.floor(diff / 7)} semanas`;
    return `En ${Math.floor(diff / 30)} meses`;
  };

  if (eventosCombinados.length === 0) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-8">
          <FaCalendarAlt className="text-4xl text-secondary mx-auto mb-3" />
          <p className="text-secondary">No hay eventos próximos</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-brand text-xl" />
          <Card.Title>Próximos Eventos</Card.Title>
        </div>
        <p className="text-sm text-secondary mt-1">
          {eventosCombinados.length} evento{eventosCombinados.length !== 1 ? 's' : ''} próximo
          {eventosCombinados.length !== 1 ? 's' : ''}
        </p>
      </Card.Header>

      <Card.Content>
        <div className="space-y-3">
          {eventosCombinados.map((evento, index) => (
            <div
              key={`${evento.tipo}-${evento.fecha}-${index}`}
              className={`p-4 rounded-lg transition-colors ${
                evento.tipo === 'feriado'
                  ? 'bg-brand/10 border border-brand/30'
                  : 'glass border border-border'
              } hover:bg-panel/10`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        evento.tipo === 'feriado'
                          ? 'bg-brand/20 text-brand'
                          : 'bg-brand-light/20 text-brand-light'
                      }`}
                    >
                      {evento.tipo === 'feriado' ? '📅 Feriado' : '🗓️ Evento'}
                    </span>
                    <span className="text-xs text-secondary">{getDiasRestantes(evento.fecha)}</span>
                  </div>

                  <h4 className="text-white font-semibold mb-1">{evento.titulo}</h4>

                  {evento.subtitulo && (
                    <p className="text-sm text-secondary mb-2">{evento.subtitulo}</p>
                  )}

                  {evento.ubicacion && (
                    <div className="flex items-center gap-1.5 text-xs text-secondary">
                      <FaMapMarkerAlt />
                      <span>{evento.ubicacion}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatearFecha(evento.fecha)}
                  </div>
                  <div className="text-xs text-secondary mt-1">
                    {new Date(evento.fecha).toLocaleDateString('es-AR', { year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>

      {eventosCombinados.length >= limit && (
        <Card.Footer>
          <p className="text-center text-sm text-secondary">
            Mostrando los próximos {limit} eventos
          </p>
        </Card.Footer>
      )}
    </Card>
  );
}
