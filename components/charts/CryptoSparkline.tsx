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

/**
 * Interpola datos usando spline Catmull-Rom para crear una curva suave
 * Similar a cómo SVG path usa "smooth" curves
 */
function catmullRomSpline(data: number[], pointsPerSegment: number = 20): number[] {
  if (data.length < 2) return data;
  if (data.length === 2) {
    // Solo 2 puntos, interpolación lineal simple
    const result: number[] = [];
    const step = (data[1] - data[0]) / pointsPerSegment;
    for (let i = 0; i <= pointsPerSegment; i++) {
      result.push(data[0] + step * i);
    }
    return result;
  }

  const result: number[] = [];

  // Catmull-Rom spline interpolation
  for (let i = 0; i < data.length - 1; i++) {
    const p0 = data[Math.max(0, i - 1)];
    const p1 = data[i];
    const p2 = data[i + 1];
    const p3 = data[Math.min(data.length - 1, i + 2)];

    for (let t = 0; t < pointsPerSegment; t++) {
      const tt = t / pointsPerSegment;
      const tt2 = tt * tt;
      const tt3 = tt2 * tt;

      // Catmull-Rom formula
      const q =
        0.5 *
        (2 * p1 +
          (-p0 + p2) * tt +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * tt2 +
          (-p0 + 3 * p1 - 3 * p2 + p3) * tt3);

      result.push(q);
    }
  }

  // Agregar el último punto
  result.push(data[data.length - 1]);

  return result;
}

export function CryptoSparkline({ data, color, trend, isCrypto = false }: CryptoSparklineProps) {
  // Para dólar/moneda (pocos puntos), interpolar con spline para curva suave
  // Para crypto (muchos puntos), usar directamente
  const shouldInterpolate = data.length < 20;

  // Aumentar puntos de interpolación para datos con pocos puntos (7 puntos → ~180 puntos)
  // Esto hace que las curvas se vean tan suaves como crypto
  const pointsPerSegment = data.length < 10 ? 30 : 15;
  const processedData = shouldInterpolate ? catmullRomSpline(data, pointsPerSegment) : data;

  // Convertir array de números a formato para Recharts
  const chartData: SparklineData[] = processedData.map((value) => ({ value }));

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
            type="natural"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
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
