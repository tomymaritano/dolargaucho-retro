/**
 * QuickAlerts Component
 *
 * Provides quick action buttons to create common alerts with one click
 */

import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaBolt, FaDollarSign, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import type { CrearAlertaInput } from '@/types/alertas';

interface QuickAlertOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  alert: CrearAlertaInput;
  color: string;
}

const quickAlerts: QuickAlertOption[] = [
  {
    id: 'blue-1300',
    label: 'Blue > $1300',
    description: 'Avísame cuando el dólar blue supere $1300',
    icon: FaDollarSign,
    color: 'text-blue-400',
    alert: {
      tipo: 'dolar',
      casaDolar: 'blue',
      nombre: 'Dólar Blue supera $1300',
      condicion: 'mayor',
      valorObjetivo: 1300,
    },
  },
  {
    id: 'blue-1100',
    label: 'Blue < $1100',
    description: 'Avísame cuando el dólar blue baje de $1100',
    icon: FaDollarSign,
    color: 'text-green-400',
    alert: {
      tipo: 'dolar',
      casaDolar: 'blue',
      nombre: 'Dólar Blue baja de $1100',
      condicion: 'menor',
      valorObjetivo: 1100,
    },
  },
  {
    id: 'inflacion-alta',
    label: 'Inflación > 8%',
    description: 'Avísame si la inflación mensual supera 8%',
    icon: FaChartLine,
    color: 'text-orange-400',
    alert: {
      tipo: 'inflacion',
      nombre: 'Inflación mensual alta (>8%)',
      condicion: 'mayor',
      valorObjetivo: 8,
    },
  },
  {
    id: 'riesgo-alto',
    label: 'Riesgo País > 1500',
    description: 'Alerta de riesgo país elevado',
    icon: FaExclamationTriangle,
    color: 'text-red-400',
    alert: {
      tipo: 'riesgo-pais',
      nombre: 'Riesgo País supera 1500',
      condicion: 'mayor',
      valorObjetivo: 1500,
    },
  },
];

interface QuickAlertsProps {
  onCreateAlert: (alert: CrearAlertaInput) => void;
}

export const QuickAlerts = React.memo(function QuickAlerts({ onCreateAlert }: QuickAlertsProps) {
  return (
    <Card variant="elevated" padding="lg" className="border border-brand/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-brand/10">
          <FaBolt className="text-brand text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Alertas Rápidas</h3>
          <p className="text-xs text-secondary">Crea alertas comunes con un solo clic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickAlerts.map((quick) => {
          const Icon = quick.icon;
          return (
            <button
              key={quick.id}
              onClick={() => onCreateAlert(quick.alert)}
              className="group p-4 rounded-xl border border-border hover:border-brand/50 bg-panel hover:bg-panel/80 transition-all text-left"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-brand/10 transition-colors">
                  <Icon className={`text-lg ${quick.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground mb-1 truncate">{quick.label}</p>
                  <p className="text-xs text-secondary line-clamp-2">{quick.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
});
