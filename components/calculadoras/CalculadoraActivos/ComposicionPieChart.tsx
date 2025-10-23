/**
 * ComposicionPieChart Component
 *
 * Single Responsibility: Display investment composition pie chart
 * Uses Canvas for custom donut chart (Lightweight Charts style)
 */

'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/Card/Card';
import { FaChartPie } from 'react-icons/fa';
import { formatearMoneda } from './utils';
import type { ResultadoAnalisis } from './types';

interface ComposicionPieChartProps {
  precioCompra: number;
  gananciaReal: number;
}

export function ComposicionPieChart({ precioCompra, gananciaReal }: ComposicionPieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dataPie = useMemo(() => {
    const total = precioCompra + Math.abs(gananciaReal);
    return [
      {
        name: 'Inversión Inicial',
        value: precioCompra,
        percentage: (precioCompra / total) * 100,
        color: '#3B82F6',
      },
      {
        name: 'Ganancia/Pérdida',
        value: Math.abs(gananciaReal),
        percentage: (Math.abs(gananciaReal) / total) * 100,
        color: gananciaReal >= 0 ? '#10B981' : '#EF4444',
      },
    ];
  }, [precioCompra, gananciaReal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Chart dimensions
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const innerRadius = radius * 0.6; // Donut hole

    // Draw donut chart
    let startAngle = -Math.PI / 2; // Start at top

    dataPie.forEach((slice, index) => {
      const sliceAngle = (slice.percentage / 100) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Draw subtle border
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Draw center circle (hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#0D0D0D';
    ctx.fill();

    // Draw center text (total value)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Total', centerX, centerY - 10);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#10B981';
    const totalValue = formatearMoneda(precioCompra + gananciaReal);
    ctx.fillText(totalValue, centerX, centerY + 10);
  }, [dataPie, precioCompra, gananciaReal]);

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="group hover:border-brand/30 transition-all duration-300"
    >
      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 group-hover:text-brand transition-colors duration-300">
        <FaChartPie className="text-brand" />
        Composición de la Inversión
      </h4>
      <div className="group-hover:scale-[1.01] transition-transform duration-300">
        <canvas ref={canvasRef} className="w-full rounded-lg" style={{ height: '300px' }} />

        {/* Legend */}
        <div className="mt-4 flex flex-col gap-2">
          {dataPie.map((slice, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: slice.color }} />
                <span className="text-secondary">{slice.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-foreground">{formatearMoneda(slice.value)}</span>
                <span className="text-secondary font-semibold min-w-[50px] text-right">
                  {slice.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
