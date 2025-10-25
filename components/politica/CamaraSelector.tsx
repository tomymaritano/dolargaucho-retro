/**
 * CamaraSelector Component
 *
 * Single Responsibility: Toggle button for selecting chamber (Senado/Diputados)
 */

import React from 'react';
import { FaLandmark, FaUsers } from 'react-icons/fa';
import type { Camara } from '@/hooks/useActasData';

interface CamaraSelectorProps {
  camara: Camara;
  onChange: (camara: Camara) => void;
}

export const CamaraSelector = React.memo(function CamaraSelector({
  camara,
  onChange,
}: CamaraSelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-panel rounded-lg border border-border/5">
      <button
        onClick={() => onChange('senado')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
          camara === 'senado'
            ? 'bg-brand text-background shadow-lg'
            : 'text-foreground hover:bg-panel/10'
        }`}
      >
        <FaLandmark />
        <span>Senado</span>
      </button>
      <button
        onClick={() => onChange('diputados')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
          camara === 'diputados'
            ? 'bg-brand text-background shadow-lg'
            : 'text-foreground hover:bg-panel/10'
        }`}
      >
        <FaUsers />
        <span>Diputados</span>
      </button>
    </div>
  );
});
