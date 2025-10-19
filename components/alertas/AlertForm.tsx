import React, { useState } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import type { TipoAlerta, CondicionAlerta, CasaDolar, CrearAlertaInput } from '@/types/alertas';
import { FaBell, FaPlus } from 'react-icons/fa';

interface AlertFormProps {
  onCrear: (input: CrearAlertaInput) => void;
}

export function AlertForm({ onCrear }: AlertFormProps) {
  const [tipo, setTipo] = useState<TipoAlerta>('dolar');
  const [nombre, setNombre] = useState('');
  const [condicion, setCondicion] = useState<CondicionAlerta>('mayor');
  const [valorObjetivo, setValorObjetivo] = useState('');
  const [casaDolar, setCasaDolar] = useState<CasaDolar>('blue');
  const [mensaje, setMensaje] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  if (!isExpanded) {
    return (
      <Button variant="primary" size="lg" onClick={() => setIsExpanded(true)} fullWidth>
        <FaPlus className="mr-2" />
        Crear Nueva Alerta
      </Button>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBell className="text-brand text-xl" />
            <Card.Title>Nueva Alerta</Card.Title>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-secondary hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de alerta */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Tipo de Indicador
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoAlerta)}
              className="w-full px-4 py-2 bg-dark-light border border-border rounded-lg text-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="dolar">Dólar</option>
              <option value="inflacion">Inflación Mensual</option>
              <option value="riesgo-pais">Riesgo País</option>
              <option value="uva">Índice UVA</option>
              <option value="tasa">Tasa Plazo Fijo</option>
            </select>
          </div>

          {/* Casa de dólar (solo si tipo === 'dolar') */}
          {tipo === 'dolar' && (
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Casa de Cambio
              </label>
              <select
                value={casaDolar}
                onChange={(e) => setCasaDolar(e.target.value as CasaDolar)}
                className="w-full px-4 py-2 bg-dark-light border border-border rounded-lg text-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
              >
                <option value="oficial">Oficial</option>
                <option value="blue">Blue</option>
                <option value="bolsa">MEP (Bolsa)</option>
                <option value="contadoconliqui">CCL</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="mayorista">Mayorista</option>
                <option value="cripto">Cripto</option>
              </select>
            </div>
          )}

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

          {/* Condición */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Condición</label>
            <select
              value={condicion}
              onChange={(e) => setCondicion(e.target.value as CondicionAlerta)}
              className="w-full px-4 py-2 bg-dark-light border border-border rounded-lg text-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="mayor">Mayor que {'>'}</option>
              <option value="menor">Menor que {'<'}</option>
              <option value="igual">Igual a (=)</option>
            </select>
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
            helperText={`Valor ${condicion === 'mayor' ? 'mínimo' : condicion === 'menor' ? 'máximo' : 'exacto'} para disparar la alerta`}
          />

          {/* Mensaje personalizado (opcional) */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Mensaje Personalizado (Opcional)
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Ej: ¡El dólar blue llegó a $1200! Hora de comprar..."
              className="w-full px-4 py-2 bg-dark-light border border-border rounded-lg text-white placeholder-secondary focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" size="md" onClick={() => setIsExpanded(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth>
              <FaPlus className="mr-2" />
              Crear Alerta
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
