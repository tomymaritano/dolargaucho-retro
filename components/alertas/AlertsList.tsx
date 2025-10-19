import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import type { Alerta } from '@/types/alertas';
import {
  FaBell,
  FaBellSlash,
  FaCheckCircle,
  FaTrash,
  FaPause,
  FaPlay,
  FaDollarSign,
  FaPercentage,
  FaExclamationTriangle,
  FaCalendar,
  FaMoneyBillWave,
} from 'react-icons/fa';

interface AlertsListProps {
  alertas: Alerta[];
  onEliminar: (id: string) => void;
  onToggle: (id: string) => void;
  getValorActual: (alerta: Alerta) => number | null;
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'dolar':
      return FaDollarSign;
    case 'inflacion':
      return FaPercentage;
    case 'riesgo-pais':
      return FaExclamationTriangle;
    case 'uva':
      return FaCalendar;
    case 'tasa':
      return FaMoneyBillWave;
    default:
      return FaBell;
  }
};

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    dolar: 'Dólar',
    inflacion: 'Inflación',
    'riesgo-pais': 'Riesgo País',
    uva: 'UVA',
    tasa: 'Tasa PF',
  };
  return labels[tipo] || tipo;
};

const getCondicionSymbol = (condicion: string) => {
  const symbols: Record<string, string> = {
    mayor: '>',
    menor: '<',
    igual: '=',
  };
  return symbols[condicion] || condicion;
};

export function AlertsList({ alertas, onEliminar, onToggle, getValorActual }: AlertsListProps) {
  if (alertas.length === 0) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-12">
          <FaBellSlash className="text-6xl text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tenés alertas configuradas</h3>
          <p className="text-secondary">
            Creá tu primera alerta para recibir notificaciones cuando
            <br />
            los indicadores alcancen los valores que te interesan
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alertas.map((alerta) => {
        const Icon = getTipoIcon(alerta.tipo);
        const valorActual = getValorActual(alerta);
        const isDisparada = alerta.estado === 'disparada';
        const isPausada = alerta.estado === 'pausada';

        return (
          <Card
            key={alerta.id}
            variant="elevated"
            padding="lg"
            className={`transition-all ${
              isDisparada ? 'border-2 border-brand' : isPausada ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Info de la alerta */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`p-3 rounded-lg ${
                      isDisparada ? 'bg-brand/20' : isPausada ? 'bg-white/5' : 'bg-white/10'
                    }`}
                  >
                    <Icon
                      className={`text-xl ${
                        isDisparada ? 'text-brand' : isPausada ? 'text-secondary' : 'text-white'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{alerta.nombre}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-secondary">
                      <span className="px-2 py-1 bg-white/10 rounded-md">
                        {getTipoLabel(alerta.tipo)}
                        {alerta.casaDolar && ` ${alerta.casaDolar.toUpperCase()}`}
                      </span>
                      <span>
                        {getCondicionSymbol(alerta.condicion)} ${alerta.valorObjetivo.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estado y valor actual */}
                <div className="flex items-center gap-4 text-sm">
                  {isDisparada && (
                    <div className="flex items-center gap-2 text-brand">
                      <FaCheckCircle />
                      <span className="font-semibold">¡Alerta disparada!</span>
                      <span className="text-secondary">
                        {alerta.fechaDisparada &&
                          new Date(alerta.fechaDisparada).toLocaleString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </span>
                    </div>
                  )}

                  {isPausada && (
                    <div className="flex items-center gap-2 text-secondary">
                      <FaPause />
                      <span>Pausada</span>
                    </div>
                  )}

                  {!isDisparada && !isPausada && valorActual !== null && (
                    <div className="text-secondary">
                      Valor actual:{' '}
                      <span className="text-white font-semibold">${valorActual.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Mensaje personalizado */}
                {alerta.mensaje && (
                  <div className="mt-3 p-3 glass rounded-lg border border-border">
                    <p className="text-sm text-white italic">&quot;{alerta.mensaje}&quot;</p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2">
                {!isDisparada && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggle(alerta.id)}
                    title={isPausada ? 'Reactivar' : 'Pausar'}
                  >
                    {isPausada ? <FaPlay /> : <FaPause />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar esta alerta?')) {
                      onEliminar(alerta.id);
                    }
                  }}
                  className="text-error hover:bg-error/10"
                  title="Eliminar"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
