'use client';

import React from 'react';
import { ResultadoAnalisis } from './types';
import { ResultadoHeader } from './ResultadoHeader';
import { RentabilidadCards } from './RentabilidadCards';
import { ValoresAbsolutosGrid } from './ValoresAbsolutosGrid';
import { RentabilidadCharts } from './RentabilidadCharts';
import { InflacionCard } from './InflacionCard';
import { DolarComparativaCard } from './DolarComparativaCard';

interface ResultadosActivoProps {
  resultado: ResultadoAnalisis;
  precioCompra: number;
  precioVenta: number;
  moneda: 'ARS' | 'USD';
}

export function ResultadosActivo({
  resultado,
  precioCompra,
  precioVenta,
  moneda,
}: ResultadosActivoProps) {
  return (
    <div className="space-y-6">
      <ResultadoHeader moneda={moneda} />

      <RentabilidadCards
        rentabilidadNominal={resultado.rentabilidadNominal}
        rentabilidadReal={resultado.rentabilidadReal}
      />

      <ValoresAbsolutosGrid
        precioCompra={precioCompra}
        precioVenta={precioVenta}
        gananciaAbsoluta={resultado.gananciaAbsoluta}
      />

      <RentabilidadCharts
        rentabilidadNominal={resultado.rentabilidadNominal}
        rentabilidadReal={resultado.rentabilidadReal}
        inflacionAcumulada={resultado.inflacionAcumulada}
        precioCompra={precioCompra}
        gananciaReal={resultado.gananciaReal}
      />

      <InflacionCard
        inflacionAcumulada={resultado.inflacionAcumulada}
        valorAjustadoInflacion={resultado.valorAjustadoInflacion}
        rentabilidadReal={resultado.rentabilidadReal}
        moneda={moneda}
      />

      <DolarComparativaCard comparativas={resultado.comparativas} precioVenta={precioVenta} />
    </div>
  );
}
