import React, { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
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
import { useToastStore } from '@/lib/store/toast-store';

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

export const AlertsList = React.memo(function AlertsList({
  alertas,
  onEliminar,
  onToggle,
  getValorActual,
}: AlertsListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertaToDelete, setAlertaToDelete] = useState<string | null>(null);
  const { addToast } = useToastStore();

  const handleDeleteClick = (alertaId: string) => {
    setAlertaToDelete(alertaId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (alertaToDelete) {
      onEliminar(alertaToDelete);
      addToast('Alerta eliminada correctamente', 'success');
    }
    setDeleteDialogOpen(false);
    setAlertaToDelete(null);
  };

  const handleToggle = (alertaId: string, isPaused: boolean) => {
    onToggle(alertaId);
    addToast(isPaused ? 'Alerta reactivada' : 'Alerta pausada', 'success');
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAlertaToDelete(null);
  };

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {alertas.map((alerta) => {
        const Icon = getTipoIcon(alerta.tipo);
        const valorActual = getValorActual(alerta);
        const isDisparada = alerta.estado === 'disparada';
        const isPausada = alerta.estado === 'pausada';

        return (
          <Card
            key={alerta.id}
            variant="elevated"
            padding="md"
            hover="glow"
            className={`transition-all border ${
              isDisparada
                ? 'border-brand/50 bg-brand/5'
                : isPausada
                  ? 'opacity-60 border-border'
                  : 'border-border'
            }`}
          >
            <div className="space-y-3">
              {/* Header con icon y acciones */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`p-2.5 rounded-lg flex-shrink-0 ${
                      isDisparada ? 'bg-brand/20' : isPausada ? 'bg-white/5' : 'bg-white/10'
                    }`}
                  >
                    <Icon
                      className={`text-lg ${
                        isDisparada
                          ? 'text-brand'
                          : isPausada
                            ? 'text-secondary'
                            : 'text-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-semibold text-sm mb-1.5 truncate">
                      {alerta.nombre}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 bg-white/10 rounded-md text-secondary">
                        {getTipoLabel(alerta.tipo)}
                        {alerta.casaDolar && ` ${alerta.casaDolar.toUpperCase()}`}
                      </span>
                      <span className="text-secondary">
                        {getCondicionSymbol(alerta.condicion)} ${alerta.valorObjetivo.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones - Más compactas */}
                <div className="flex gap-1 flex-shrink-0">
                  {!isDisparada && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggle(alerta.id, isPausada)}
                      title={isPausada ? 'Reactivar' : 'Pausar'}
                      className="h-8 w-8 p-0 flex items-center justify-center"
                    >
                      {isPausada ? <FaPlay className="text-xs" /> : <FaPause className="text-xs" />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(alerta.id)}
                    className="h-8 w-8 p-0 flex items-center justify-center text-error hover:bg-error/10"
                    title="Eliminar"
                  >
                    <FaTrash className="text-xs" />
                  </Button>
                </div>
              </div>

              {/* Estado y valor actual - Más compacto */}
              <div className="text-xs">
                {isDisparada && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-brand/10 border border-brand/30">
                    <FaCheckCircle className="text-brand flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-brand">¡Disparada!</span>
                      <span className="text-secondary ml-2 text-xs">
                        {alerta.fechaDisparada &&
                          new Date(alerta.fechaDisparada).toLocaleString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </span>
                    </div>
                  </div>
                )}

                {isPausada && (
                  <div className="flex items-center gap-2 text-secondary">
                    <FaPause className="text-xs" />
                    <span>Pausada</span>
                  </div>
                )}

                {!isDisparada && !isPausada && valorActual !== null && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-panel border border-border">
                    <span className="text-secondary">Valor actual:</span>
                    <span className="text-foreground font-bold font-mono">
                      ${valorActual.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Mensaje personalizado - Si existe */}
              {alerta.mensaje && (
                <div className="p-2.5 rounded-lg bg-panel/50 border border-border/50">
                  <p className="text-xs text-secondary italic line-clamp-2">
                    &quot;{alerta.mensaje}&quot;
                  </p>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar alerta?"
        description="Esta acción no se puede deshacer. La alerta se eliminará permanentemente de tu lista."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
});
