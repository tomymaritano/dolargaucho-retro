import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineData {
  value: number;
}

interface CryptoSparklineProps {
  data: number[]; // Array de precios (últimos 7 días)
  color?: string;
  trend: 'up' | 'down' | 'neutral';
  /** Si es crypto (up=verde) o dólar/moneda (up=rojo). Default: false (dólar) */
  isCrypto?: boolean;
}

export function CryptoSparkline({ data, color, trend, isCrypto = false }: CryptoSparklineProps) {
  // Convertir array de números a formato para Recharts
  const chartData: SparklineData[] = data.map((value) => ({ value }));

  // Si no hay suficientes datos, mostrar placeholder
  if (!data || data.length < 2) {
    return (
      <div className="w-28 h-12 flex items-center justify-center">
        <span className="text-xs text-secondary">-</span>
      </div>
    );
  }

  // Colores basados en tendencia
  let lineColor: string;
  if (color) {
    lineColor = color;
  } else if (isCrypto) {
    // Crypto: up=verde (gano), down=rojo (pierdo)
    lineColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#f59e0b';
  } else {
    // Dólar/Moneda: up=rojo (pierdo poder adquisitivo), down=verde (gano)
    lineColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#10b981' : '#f59e0b';
  }

  return (
    <div className="w-28 h-12 mx-auto flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
