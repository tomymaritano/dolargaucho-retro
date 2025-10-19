# Investment Predictions Bot - Implementation Guide

## 📊 Overview

This guide explains how to implement an AI/ML-powered predictions bot for analyzing historical data and making investment recommendations in Dólar Gaucho.

**⚠️ IMPORTANT LEGAL DISCLAIMER**: Any investment predictions or recommendations **must** include:

1. Clear disclaimers that these are estimates, not financial advice
2. Warning that past performance doesn't guarantee future results
3. Recommendation to consult professional financial advisors
4. Statement that predictions are for educational/informational purposes only

---

## 🎯 What Can Be Predicted?

### ✅ Suitable for Prediction:

1. **Dólar Blue Trends** - Short-term trends (1-7 days)
2. **Crypto Price Movements** - Volatility patterns
3. **Inflation Trends** - Monthly/quarterly projections
4. **Riesgo País** - Country risk trends
5. **Plazo Fijo Returns** - Expected returns vs inflation

### ❌ NOT Suitable (too complex/volatile):

- Long-term predictions (>30 days)
- Political events impact
- International crises
- Market manipulation events

---

## 🚀 Implementation Options

### Option A: Simple Statistical Analysis (Recommended for MVP)

**Pros:**

- No external dependencies
- Fast and cheap
- Easy to understand
- Good for trends

**Cons:**

- Limited accuracy
- Can't handle complex patterns

**Implementation:**

- Linear regression
- Moving averages
- Trend analysis
- Volatility calculations

### Option B: TensorFlow.js (Advanced ML in Browser)

**Pros:**

- Runs in browser (no server needed)
- Good accuracy
- Can handle complex patterns

**Cons:**

- Heavier bundle size
- More complex setup
- Needs more historical data

**Implementation:**

- Time series prediction
- LSTM networks
- Neural networks

### Option C: OpenAI/Anthropic Integration (Cloud AI)

**Pros:**

- Very powerful
- Natural language analysis
- Can analyze news sentiment

**Cons:**

- Costs per API call
- Requires API key
- Privacy concerns (data sent to API)

**Implementation:**

- Claude/GPT-4 for analysis
- Sentiment analysis of news
- Context-aware predictions

---

## 🛠️ Option A: Simple Statistical Analysis (Step-by-Step)

### Step 1: Create Prediction Service

**File:** `lib/services/predictions.ts`

```typescript
/**
 * Simple statistical predictions service
 * Uses historical data to predict trends
 */

interface HistoricalDataPoint {
  fecha: string;
  valor: number;
}

interface PredictionResult {
  prediction: number;
  confidence: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  reasoning: string;
}

/**
 * Calculate simple moving average
 */
function calculateSMA(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1];
  const slice = data.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return sum / period;
}

/**
 * Calculate linear regression to predict next value
 */
function linearRegression(data: number[]): number {
  const n = data.length;
  if (n === 0) return 0;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Predict next value (n)
  return slope * n + intercept;
}

/**
 * Calculate standard deviation (volatility)
 */
function calculateStdDev(data: number[]): number {
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const squaredDiffs = data.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / data.length;
  return Math.sqrt(variance);
}

/**
 * Predict next value using linear regression and moving averages
 */
export function predictNextValue(
  historicalData: HistoricalDataPoint[],
  name: string
): PredictionResult {
  // Ordenar por fecha
  const sorted = [...historicalData].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const values = sorted.map((d) => d.valor);
  const currentValue = values[values.length - 1];

  // Calcular predicción con regresión lineal
  const predicted = linearRegression(values);

  // Calcular promedio móvil de 7 días
  const sma7 = calculateSMA(values, 7);

  // Calcular promedio móvil de 30 días
  const sma30 = calculateSMA(values, 30);

  // Calcular volatilidad
  const volatility = calculateStdDev(values.slice(-30)); // Últimos 30 días
  const volatilityPercent = (volatility / currentValue) * 100;

  // Determinar tendencia
  let trend: 'up' | 'down' | 'stable' = 'stable';
  const change = ((predicted - currentValue) / currentValue) * 100;

  if (change > 2) trend = 'up';
  else if (change < -2) trend = 'down';

  // Calcular confianza basada en volatilidad y cantidad de datos
  // Menor volatilidad = mayor confianza
  // Más datos = mayor confianza
  const dataQualityScore = Math.min(values.length / 30, 1) * 50; // Max 50 puntos
  const volatilityScore = Math.max(50 - volatilityPercent, 0); // Max 50 puntos
  const confidence = Math.round(dataQualityScore + volatilityScore);

  // Generar razonamiento
  const reasoning = generateReasoning(
    name,
    trend,
    change,
    volatilityPercent,
    sma7,
    sma30,
    currentValue
  );

  return {
    prediction: Math.round(predicted * 100) / 100,
    confidence,
    trend,
    reasoning,
  };
}

function generateReasoning(
  name: string,
  trend: 'up' | 'down' | 'stable',
  change: number,
  volatility: number,
  sma7: number,
  sma30: number,
  current: number
): string {
  const trendText = trend === 'up' ? 'al alza' : trend === 'down' ? 'a la baja' : 'estable';

  const volatilityText =
    volatility > 10
      ? 'alta volatilidad'
      : volatility > 5
        ? 'volatilidad moderada'
        : 'baja volatilidad';

  const smaComparison =
    current > sma7 ? 'por encima del promedio de 7 días' : 'por debajo del promedio de 7 días';

  return (
    `Basado en el análisis de tendencias, se proyecta que ${name} mantendrá una tendencia ${trendText} ` +
    `(${change > 0 ? '+' : ''}${change.toFixed(2)}%). El mercado muestra ${volatilityText}, ` +
    `con el valor actual ${smaComparison} ($${sma7.toFixed(2)}).`
  );
}

/**
 * Analyze multiple assets and recommend best option
 */
export function analyzeBestInvestment(
  dolares: Array<{ nombre: string; data: HistoricalDataPoint[] }>,
  days: number = 7
): {
  recommended: string;
  prediction: PredictionResult;
  alternatives: Array<{ nombre: string; prediction: PredictionResult }>;
} {
  const predictions = dolares.map((dolar) => ({
    nombre: dolar.nombre,
    prediction: predictNextValue(dolar.data, dolar.nombre),
  }));

  // Ordenar por mejor predicción (mayor rentabilidad esperada con alta confianza)
  const scored = predictions
    .map((p) => ({
      ...p,
      score:
        (p.prediction.trend === 'up' ? 1 : p.prediction.trend === 'down' ? -1 : 0) *
        p.prediction.confidence,
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternatives = scored.slice(1, 3);

  return {
    recommended: best.nombre,
    prediction: best.prediction,
    alternatives,
  };
}
```

### Step 2: Create Prediction Hook

**File:** `hooks/usePredictions.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { useDolarHistorico } from './useDolarHistorico';
import { predictNextValue, analyzeBestInvestment } from '@/lib/services/predictions';

/**
 * Hook para predecir el próximo valor de un dólar
 */
export function useDolarPrediction(casa: string) {
  const { data: historicalData, isLoading } = useDolarHistorico(casa, 30); // Últimos 30 días

  return useQuery({
    queryKey: ['prediction', casa, historicalData],
    queryFn: () => {
      if (!historicalData || historicalData.length === 0) {
        throw new Error('No hay datos históricos suficientes');
      }

      return predictNextValue(historicalData, casa);
    },
    enabled: !isLoading && !!historicalData && historicalData.length >= 7,
    staleTime: 60 * 60 * 1000, // 1 hora (predicciones no cambian tan rápido)
  });
}

/**
 * Hook para analizar mejor inversión entre varios dólares
 */
export function useBestInvestment(casas: string[]) {
  // Fetch historical data for all casas
  const historicalQueries = casas.map((casa) => ({
    casa,
    ...useDolarHistorico(casa, 30),
  }));

  const isLoading = historicalQueries.some((q) => q.isLoading);
  const allDataReady = historicalQueries.every((q) => q.data && q.data.length >= 7);

  return useQuery({
    queryKey: ['best-investment', casas, historicalQueries.map((q) => q.data)],
    queryFn: () => {
      const dolares = historicalQueries
        .filter((q) => q.data && q.data.length >= 7)
        .map((q) => ({
          nombre: q.casa,
          data: q.data!,
        }));

      return analyzeBestInvestment(dolares);
    },
    enabled: !isLoading && allDataReady,
    staleTime: 60 * 60 * 1000, // 1 hora
  });
}
```

### Step 3: Create Prediction UI Component

**File:** `components/predictions/PredictionCard.tsx`

```typescript
import { Card } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import { useDolarPrediction } from '@/hooks/usePredictions';

interface PredictionCardProps {
  casa: string;
  nombre: string;
  currentValue: number;
}

export function PredictionCard({ casa, nombre, currentValue }: PredictionCardProps) {
  const { data: prediction, isLoading, isError } = useDolarPrediction(casa);

  if (isLoading) {
    return (
      <Card elevation="md" padding="lg">
        <div className="animate-pulse">
          <div className="h-6 bg-white/5 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-white/5 rounded"></div>
        </div>
      </Card>
    );
  }

  if (isError || !prediction) {
    return (
      <Card elevation="md" padding="lg">
        <p className="text-error text-sm">No hay datos suficientes para predecir</p>
      </Card>
    );
  }

  const TrendIcon =
    prediction.trend === 'up' ? FaArrowUp : prediction.trend === 'down' ? FaArrowDown : FaMinus;

  const trendColor =
    prediction.trend === 'up'
      ? 'text-success'
      : prediction.trend === 'down'
        ? 'text-error'
        : 'text-warning';

  const change = ((prediction.prediction - currentValue) / currentValue) * 100;

  return (
    <Card elevation="lg" hover="lift" padding="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-blue/20 rounded-lg">
            <FaChartLine className="text-xl text-accent-blue" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{nombre}</h3>
            <p className="text-xs text-secondary">Predicción a 24 horas</p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <CircularProgress
          value={prediction.confidence}
          size="md"
          color={prediction.confidence > 70 ? 'emerald' : prediction.confidence > 50 ? 'gold' : 'error'}
          showPercentage
          label="Confianza"
        />
      </div>

      {/* Prediction Value */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-bold text-accent-blue tabular-nums">
            ${prediction.prediction.toFixed(2)}
          </span>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="text-sm" />
            <span className="font-semibold">
              {change > 0 ? '+' : ''}
              {change.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-xs text-secondary">
          Valor actual: ${currentValue.toFixed(2)}
        </p>
      </div>

      {/* Reasoning */}
      <div className="p-4 glass rounded-lg">
        <p className="text-sm text-secondary leading-relaxed">{prediction.reasoning}</p>
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
        <p className="text-xs text-warning">
          ⚠️ Esta es una estimación estadística basada en datos históricos. No constituye asesoramiento
          financiero. Los resultados pasados no garantizan rendimientos futuros. Consulte a un asesor
          profesional antes de tomar decisiones de inversión.
        </p>
      </div>
    </Card>
  );
}
```

### Step 4: Create Investment Recommendation Component

**File:** `components/predictions/BestInvestmentCard.tsx`

```typescript
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { useBestInvestment } from '@/hooks/usePredictions';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

export function BestInvestmentCard() {
  const { data, isLoading, isError } = useBestInvestment(['blue', 'oficial', 'mep', 'ccl']);

  if (isLoading) return <SkeletonCard />;
  if (isError || !data) return null;

  return (
    <div className="space-y-4">
      {/* Recommended Investment */}
      <Card elevation="xl" padding="lg" className="border-2 border-accent-emerald">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-accent-emerald/20 rounded-xl">
            <FaTrophy className="text-3xl text-accent-emerald" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">Mejor Inversión Proyectada</h3>
              <StatusBadge variant="emerald">RECOMENDADO</StatusBadge>
            </div>
            <p className="text-2xl font-bold text-accent-emerald mb-2">{data.recommended}</p>
            <p className="text-sm text-secondary mb-4">{data.prediction.reasoning}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-secondary">Predicción</p>
                <p className="text-lg font-bold text-accent-emerald">
                  ${data.prediction.prediction.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary">Confianza</p>
                <p className="text-lg font-bold">{data.prediction.confidence}%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Alternatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.alternatives.map((alt, index) => (
          <Card key={alt.nombre} elevation="md" padding="lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <FaMedal className="text-lg text-secondary" />
              </div>
              <div>
                <p className="text-sm text-secondary">Alternativa #{index + 1}</p>
                <p className="font-bold">{alt.nombre}</p>
              </div>
            </div>
            <p className="text-xs text-secondary mb-2">{alt.prediction.reasoning}</p>
            <p className="text-sm">
              Predicción:{' '}
              <span className="font-bold">${alt.prediction.prediction.toFixed(2)}</span>
            </p>
          </Card>
        ))}
      </div>

      {/* Legal Disclaimer */}
      <div className="p-4 glass border border-warning/20 rounded-lg">
        <p className="text-xs text-secondary text-center">
          ⚠️ Las predicciones son estimaciones basadas en análisis estadístico de datos históricos y no
          constituyen asesoramiento financiero. Los mercados son volátiles y los resultados pueden variar.
          Consulte a un profesional antes de invertir.
        </p>
      </div>
    </div>
  );
}
```

---

## 📱 Usage Example

### In Dashboard

```typescript
import { PredictionCard } from '@/components/predictions/PredictionCard';
import { BestInvestmentCard } from '@/components/predictions/BestInvestmentCard';

export default function DashboardPage() {
  const { data: dolares } = useDolares();

  return (
    <DashboardLayout>
      {/* Best Investment Recommendation */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Análisis de Inversión</h2>
        <BestInvestmentCard />
      </section>

      {/* Individual Predictions */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Predicciones por Cotización</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dolares?.slice(0, 6).map((dolar) => (
            <PredictionCard
              key={dolar.casa}
              casa={dolar.casa}
              nombre={dolar.nombre}
              currentValue={dolar.venta}
            />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
```

---

## 🧪 Testing

### Test Prediction Logic

```typescript
import { predictNextValue } from '@/lib/services/predictions';

describe('Predictions Service', () => {
  it('should predict upward trend', () => {
    const data = [
      { fecha: '2024-01-01', valor: 100 },
      { fecha: '2024-01-02', valor: 105 },
      { fecha: '2024-01-03', valor: 110 },
      { fecha: '2024-01-04', valor: 115 },
    ];

    const result = predictNextValue(data, 'Test');

    expect(result.trend).toBe('up');
    expect(result.prediction).toBeGreaterThan(115);
  });

  it('should predict downward trend', () => {
    const data = [
      { fecha: '2024-01-01', valor: 115 },
      { fecha: '2024-01-02', valor: 110 },
      { fecha: '2024-01-03', valor: 105 },
      { fecha: '2024-01-04', valor: 100 },
    ];

    const result = predictNextValue(data, 'Test');

    expect(result.trend).toBe('down');
    expect(result.prediction).toBeLessThan(100);
  });
});
```

---

## 🚨 Legal Disclaimers (REQUIRED)

### All prediction components MUST include:

```typescript
<div className="p-4 glass border border-warning/20 rounded-lg">
  <p className="text-xs text-secondary">
    ⚠️ DESCARGO DE RESPONSABILIDAD:
    <br />
    • Las predicciones son estimaciones estadísticas basadas en datos históricos
    <br />
    • No constituyen asesoramiento financiero profesional
    <br />
    • Los resultados pasados no garantizan rendimientos futuros
    <br />
    • Los mercados son volátiles y sujetos a cambios impredecibles
    <br />
    • Consulte a un asesor financiero profesional antes de invertir
    <br />• Dólar Gaucho no se responsabiliza por decisiones de inversión basadas en estas
    predicciones
  </p>
</div>
```

---

## 📊 Metrics to Track

1. **Prediction Accuracy** - Compare predictions vs actual values
2. **Confidence Correlation** - Do high confidence predictions perform better?
3. **User Engagement** - How many users view predictions?
4. **Investment Success** - Track if users report better outcomes

---

## 🔮 Future Enhancements

1. **Sentiment Analysis** - Analyze news headlines
2. **Multi-factor Models** - Combine multiple indicators
3. **User Feedback Loop** - Let users rate prediction accuracy
4. **Personalized Recommendations** - Based on user risk profile
5. **Push Notifications** - Alert users to investment opportunities

---

## 🎓 Summary

✅ **What we built:**

- Statistical prediction service
- Linear regression + moving averages
- Confidence scoring
- Best investment recommendations
- UI components with legal disclaimers

✅ **Ready to use:**

- Import `useDolarPrediction(casa)` hook
- Render `<PredictionCard />` component
- Display predictions with confidence levels

✅ **Legal compliance:**

- All disclaimers included
- Clear "not financial advice" warnings
- Educational/informational purpose stated

**Next step:** Test with real data and iterate based on accuracy metrics.
