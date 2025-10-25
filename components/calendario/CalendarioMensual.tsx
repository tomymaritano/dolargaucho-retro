import React, { useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import type { Feriado, EventoPresidencial } from '@/types/api/argentina';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CalendarioMensualProps {
  mes: number; // 0-11
  año: number;
  feriados: Feriado[];
  eventos: EventoPresidencial[];
  onMesChange: (mes: number, año: number) => void;
  onDiaClick?: (
    fecha: Date,
    feriadosDelDia: Feriado[],
    eventosDelDia: EventoPresidencial[]
  ) => void;
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const CalendarioMensual = React.memo(function CalendarioMensual({
  mes,
  año,
  feriados,
  eventos,
  onMesChange,
  onDiaClick,
}: CalendarioMensualProps) {
  const diasDelMes = useMemo(() => {
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay(); // 0 = Domingo

    const dias: Array<{
      fecha: Date;
      numero: number;
      esOtroMes: boolean;
      esFeriado: boolean;
      tieneEvento: boolean;
      feriados: Feriado[];
      eventos: EventoPresidencial[];
    }> = [];

    // Días del mes anterior (para completar la primera semana)
    const diasMesAnterior = new Date(año, mes, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      dias.push({
        fecha: new Date(año, mes - 1, diasMesAnterior - i),
        numero: diasMesAnterior - i,
        esOtroMes: true,
        esFeriado: false,
        tieneEvento: false,
        feriados: [],
        eventos: [],
      });
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(año, mes, dia);
      const fechaStr = fecha.toISOString().split('T')[0];

      const feriadosDelDia = feriados.filter((f) => f.fecha === fechaStr);
      const eventosDelDia = eventos.filter((e) => e.fecha === fechaStr);

      dias.push({
        fecha,
        numero: dia,
        esOtroMes: false,
        esFeriado: feriadosDelDia.length > 0,
        tieneEvento: eventosDelDia.length > 0,
        feriados: feriadosDelDia,
        eventos: eventosDelDia,
      });
    }

    // Días del mes siguiente (para completar la última semana)
    const diasRestantes = 42 - dias.length; // 6 semanas * 7 días
    for (let dia = 1; dia <= diasRestantes; dia++) {
      dias.push({
        fecha: new Date(año, mes + 1, dia),
        numero: dia,
        esOtroMes: true,
        esFeriado: false,
        tieneEvento: false,
        feriados: [],
        eventos: [],
      });
    }

    return dias;
  }, [mes, año, feriados, eventos]);

  const handleMesAnterior = () => {
    if (mes === 0) {
      onMesChange(11, año - 1);
    } else {
      onMesChange(mes - 1, año);
    }
  };

  const handleMesSiguiente = () => {
    if (mes === 11) {
      onMesChange(0, año + 1);
    } else {
      onMesChange(mes + 1, año);
    }
  };

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  return (
    <Card variant="elevated" padding="lg">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleMesAnterior}
          className="p-2 rounded-lg glass hover:bg-panel/20 transition-colors text-white"
        >
          <FaChevronLeft />
        </button>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white">
            {MESES[mes]} {año}
          </h3>
          <p className="text-sm text-secondary">
            {feriados.length} feriado{feriados.length !== 1 ? 's' : ''} • {eventos.length} evento
            {eventos.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={handleMesSiguiente}
          className="p-2 rounded-lg glass hover:bg-panel/20 transition-colors text-white"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="text-center text-sm font-semibold text-secondary py-2">
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-2">
        {diasDelMes.map((dia, index) => {
          const hoy = esHoy(dia.fecha);

          return (
            <button
              key={index}
              onClick={() => {
                if (!dia.esOtroMes && onDiaClick) {
                  onDiaClick(dia.fecha, dia.feriados, dia.eventos);
                }
              }}
              disabled={dia.esOtroMes}
              className={`
                aspect-square p-2 rounded-lg transition-all relative
                ${
                  dia.esOtroMes
                    ? 'text-secondary/30 cursor-not-allowed'
                    : 'text-white hover:bg-panel/20 cursor-pointer'
                }
                ${hoy ? 'ring-2 ring-brand' : ''}
                ${dia.esFeriado ? 'bg-brand/20' : 'glass'}
                ${dia.tieneEvento && !dia.esFeriado ? 'bg-brand-light/10' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-sm font-semibold ${hoy ? 'text-brand' : ''}`}>
                  {dia.numero}
                </span>

                {/* Indicadores */}
                <div className="flex gap-1 mt-1">
                  {dia.esFeriado && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                  {dia.tieneEvento && <div className="w-1.5 h-1.5 rounded-full bg-brand-light" />}
                </div>
              </div>

              {/* Tooltip con info */}
              {(dia.esFeriado || dia.tieneEvento) && !dia.esOtroMes && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                  <div className="glass-strong border border-border rounded-lg p-2 text-xs whitespace-nowrap">
                    {dia.feriados.map((f) => (
                      <div key={f.fecha} className="text-brand">
                        📅 {f.nombre}
                      </div>
                    ))}
                    {dia.eventos.map((e) => (
                      <div key={e.fecha} className="text-brand-light">
                        🗓️ {e.descripcion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand" />
          <span className="text-sm text-secondary">Feriado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-light" />
          <span className="text-sm text-secondary">Evento Presidencial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-brand" />
          <span className="text-sm text-secondary">Hoy</span>
        </div>
      </div>
    </Card>
  );
});
