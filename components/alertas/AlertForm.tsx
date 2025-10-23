import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import type { TipoAlerta, CondicionAlerta, CasaDolar, CrearAlertaInput } from '@/types/alertas';
import {
  FaBell,
  FaPlus,
  FaDollarSign,
  FaChartLine,
  FaExclamationTriangle,
  FaCalendar,
  FaPercentage,
} from 'react-icons/fa';

interface AlertFormProps {
  onCrear: (input: CrearAlertaInput) => void;
  defaultExpanded?: boolean;
}

const tipoOptions = [
  { value: 'dolar', label: 'Dólar', icon: FaDollarSign },
  { value: 'inflacion', label: 'Inflación', icon: FaChartLine },
  { value: 'riesgo-pais', label: 'Riesgo País', icon: FaExclamationTriangle },
  { value: 'uva', label: 'UVA', icon: FaCalendar },
  { value: 'tasa', label: 'Tasa PF', icon: FaPercentage },
];

export const AlertForm = React.memo(function AlertForm({
  onCrear,
  defaultExpanded = false,
}: AlertFormProps) {
  const [tipo, setTipo] = useState<TipoAlerta>('dolar');
  const [nombre, setNombre] = useState('');
  const [condicion, setCondicion] = useState<CondicionAlerta>('mayor');
  const [valorObjetivo, setValorObjetivo] = useState('');
  const [casaDolar, setCasaDolar] = useState<CasaDolar>('blue');
  const [mensaje, setMensaje] = useState('');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!nombre.trim() || !valorObjetivo) {
        alert('Por favor completá todos los campos obligatorios');
        return;
      }

      const input: CrearAlertaInput = {
        tipo,
        nombre: nombre.trim(),
        condicion,
        valorObjetivo: parseFloat(valorObjetivo),
        mensaje: mensaje.trim() || undefined,
      };

      if (tipo === 'dolar') {
        input.casaDolar = casaDolar;
      }

      onCrear(input);

      // Reset form
      setNombre('');
      setValorObjetivo('');
      setMensaje('');
      setIsExpanded(false);
    },
    [tipo, nombre, condicion, valorObjetivo, casaDolar, mensaje, onCrear]
  );

  if (!isExpanded) {
    return null;
  }

  return (
    <Card variant="elevated" padding="lg" className="border border-brand/20">
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand/10">
              <FaBell className="text-brand text-xl" />
            </div>
            <div>
              <Card.Title>Nueva Alerta Personalizada</Card.Title>
              <p className="text-xs text-secondary mt-1">
                Configura tu alerta con los parámetros que necesites
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-secondary hover:text-foreground transition-colors text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de alerta - Visual Grid */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Tipo de Indicador
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {tipoOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = tipo === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTipo(option.value as TipoAlerta)}
                    className={`p-4 rounded-xl border transition-all text-center ${
                      isSelected
                        ? 'border-brand bg-brand/10'
                        : 'border-border hover:border-brand/50 hover:bg-panel/50'
                    }`}
                  >
                    <Icon
                      className={`text-2xl mx-auto mb-2 ${isSelected ? 'text-brand' : 'text-secondary'}`}
                    />
                    <span
                      className={`text-xs font-medium ${isSelected ? 'text-brand' : 'text-secondary'}`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Casa de dólar (solo si tipo === 'dolar') */}
          {tipo === 'dolar' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Casa de Cambio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'oficial', label: 'Oficial' },
                  { value: 'blue', label: 'Blue' },
                  { value: 'bolsa', label: 'MEP' },
                  { value: 'contadoconliqui', label: 'CCL' },
                  { value: 'tarjeta', label: 'Tarjeta' },
                  { value: 'mayorista', label: 'Mayorista' },
                  { value: 'cripto', label: 'Cripto' },
                ].map((casa) => (
                  <button
                    key={casa.value}
                    type="button"
                    onClick={() => setCasaDolar(casa.value as CasaDolar)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      casaDolar === casa.value
                        ? 'bg-brand text-background-dark'
                        : 'bg-panel border border-border text-secondary hover:text-foreground hover:border-brand/30'
                    }`}
                  >
                    {casa.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Condición - Visual */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Condición</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'mayor', label: 'Mayor >', icon: '↑' },
                  { value: 'menor', label: 'Menor <', icon: '↓' },
                  { value: 'igual', label: 'Igual =', icon: '=' },
                ].map((cond) => (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => setCondicion(cond.value as CondicionAlerta)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      condicion === cond.value
                        ? 'bg-brand text-background-dark'
                        : 'bg-panel border border-border text-secondary hover:text-foreground'
                    }`}
                  >
                    <div className="text-xl mb-1">{cond.icon}</div>
                    <div className="text-xs">{cond.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Valor objetivo */}
            <Input
              label="Valor Objetivo"
              type="number"
              step="0.01"
              placeholder="Ej: 1200"
              value={valorObjetivo}
              onChange={(e) => setValorObjetivo(e.target.value)}
              required
              helperText={`Valor ${condicion === 'mayor' ? 'mínimo' : condicion === 'menor' ? 'máximo' : 'exacto'}`}
            />
          </div>

          {/* Nombre de la alerta */}
          <Input
            label="Nombre de la Alerta"
            type="text"
            placeholder="Ej: Dólar Blue supera $1200"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            helperText="Dale un nombre descriptivo a tu alerta"
          />

          {/* Mensaje personalizado (opcional) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mensaje Personalizado{' '}
              <span className="text-xs text-secondary font-normal">(Opcional)</span>
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Ej: ¡El dólar blue llegó a $1200! Hora de comprar..."
              className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-foreground placeholder-secondary focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsExpanded(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" className="flex-1">
              <FaPlus className="mr-2" />
              Crear Alerta
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
});
