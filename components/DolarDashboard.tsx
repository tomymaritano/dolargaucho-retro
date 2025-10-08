'use client';

import { useDolarQuery, useDolarByType } from '@/hooks/useDolarQuery';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { DolarType } from '@/types/api/dolar';

/**
 * Example Dashboard Component
 * Demonstrates usage of TanStack Query hooks and CVA components
 */
export function DolarDashboard() {
  const [selectedType, setSelectedType] = useState<DolarType>('blue');

  // Fetch all dolares with auto-refresh
  const { data: dolares, isLoading: loadingAll, error: errorAll } = useDolarQuery();

  // Fetch specific dolar type
  const { data: selectedDolar, isLoading: loadingSelected } = useDolarByType(selectedType);

  // Loading state
  if (loadingAll) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-emerald border-t-transparent" />
          <p className="text-sm text-secondary">Cargando cotizaciones...</p>
        </div>
      </Card>
    );
  }

  // Error state
  if (errorAll) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center">
          <p className="text-error mb-4">Error al cargar datos</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with type selector */}
      <Card variant="elevated" padding="lg" hover="glow">
        <Card.Header>
          <Card.Title>Cotizaciones del Dólar</Card.Title>
          <Card.Description>Actualizadas automáticamente cada 30 segundos</Card.Description>
        </Card.Header>

        <Card.Content>
          {/* Type selector buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {[
              { value: 'oficial' as DolarType, label: 'OFICIAL' },
              { value: 'blue' as DolarType, label: 'BLUE' },
              { value: 'bolsa' as DolarType, label: 'MEP' },
              { value: 'contadoconliqui' as DolarType, label: 'CCL' },
            ].map(({ value, label }) => (
              <Button
                key={value}
                variant={selectedType === value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(value)}
                fullWidth
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Selected dolar display */}
          {loadingSelected ? (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent-emerald border-t-transparent" />
            </div>
          ) : selectedDolar ? (
            <div className="text-center p-6 glass rounded-xl">
              <h3 className="text-sm uppercase tracking-wider text-secondary mb-2">
                {selectedDolar.nombre}
              </h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div>
                  <p className="text-xs text-secondary mb-1">Compra</p>
                  <p className="text-2xl font-mono font-bold text-accent-emerald">
                    ${selectedDolar.compra.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary mb-1">Venta</p>
                  <p className="text-2xl font-mono font-bold text-accent-teal">
                    ${selectedDolar.venta.toFixed(2)}
                  </p>
                </div>
              </div>
              {selectedDolar.fechaActualizacion && (
                <p className="text-xs text-secondary mt-3">
                  Actualizado: {new Date(selectedDolar.fechaActualizacion).toLocaleString('es-AR')}
                </p>
              )}
            </div>
          ) : null}
        </Card.Content>
      </Card>

      {/* All quotations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dolares?.map((dolar) => (
          <Card key={dolar.nombre} variant="default" padding="md" hover="scale">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">{dolar.nombre}</h3>
              <span className="text-xs text-secondary px-2 py-1 glass rounded">{dolar.casa}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider">Compra</p>
                <p className="text-xl font-mono text-accent-emerald">${dolar.compra.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-secondary uppercase tracking-wider">Venta</p>
                <p className="text-xl font-mono text-accent-teal">${dolar.venta.toFixed(2)}</p>
              </div>
            </div>

            {dolar.fechaActualizacion && (
              <p className="text-xs text-secondary mt-3 text-center">
                {new Date(dolar.fechaActualizacion).toLocaleTimeString('es-AR')}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
