import React from 'react';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { FaRegStar } from 'react-icons/fa';

/**
 * EmptyFavoritesState Component
 *
 * Displays a friendly empty state when user has no favorites saved.
 * Encourages users to visit the dashboard to add favorites.
 *
 * @component
 * @example
 * <EmptyFavoritesState />
 */
export function EmptyFavoritesState() {
  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center py-12">
        <FaRegStar className="text-6xl text-secondary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">No tenés favoritos guardados</h3>
        <p className="text-secondary mb-6">
          Empezá agregando tus cotizaciones favoritas para un acceso rápido
        </p>
        <Button variant="primary" size="md" onClick={() => (window.location.href = '/dashboard')}>
          Ir al Dashboard
        </Button>
      </div>
    </Card>
  );
}
