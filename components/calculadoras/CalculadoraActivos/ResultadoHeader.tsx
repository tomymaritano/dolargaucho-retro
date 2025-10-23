interface ResultadoHeaderProps {
  moneda: 'ARS' | 'USD';
}

export function ResultadoHeader({ moneda }: ResultadoHeaderProps) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-foreground mb-2">Análisis de Rentabilidad</h3>
      <p className="text-secondary">Comparación entre inversión real y alternativas</p>
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-sm text-secondary">Moneda:</span>
        <span className="px-3 py-1 bg-brand/20 text-brand rounded-full font-semibold">
          {moneda === 'USD' ? '🇺🇸 USD' : '🇦🇷 ARS'}
        </span>
      </div>
    </div>
  );
}
