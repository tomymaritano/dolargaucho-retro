# TradingView Lightweight Charts - Guía de Uso

## ¿Qué implementamos?

Hemos integrado **TradingView Lightweight Charts** - la librería oficial de TradingView para gráficos profesionales. Es la misma tecnología que usan plataformas como Binance, Coinbase y TradingView.

## ⚠️ Importante: ¿Candlesticks o Area Charts?

### Para el Dólar Argentino: **Area Charts son mejores**

**¿Por qué NO candlesticks?**

- El dólar argentino tiene **una sola cotización por día** (precio de cierre)
- Los candlesticks OHLC requieren datos **intraday** (múltiples cotizaciones en el día)
- Simular OHLC desde un solo precio es **engañoso** para análisis técnico

**¿Cuándo usar candlesticks?**

- Acciones que cotizan en bolsa (múltiples transacciones por día)
- Criptomonedas (cotización continua 24/7)
- Cualquier activo con datos intraday reales

**Para dólar argentino, usamos:**

- **DolarAreaChart** - Area con baseline (muestra ganancia/pérdida)
- **InflacionLightweightChart** - Line chart para inflación
- **RiesgoPaisLightweightChart** - Area chart para riesgo país

## Componentes Disponibles

### 1. LightweightCandlestickChart

**Uso:** Gráficos OHLC (Open, High, Low, Close) estilo velas japonesas.

```tsx
import { LightweightCandlestickChart } from '@/components/charts/LightweightCandlestickChart';

const data = [
  { time: 1642425600, open: 100, high: 105, low: 98, close: 103 },
  { time: 1642512000, open: 103, high: 107, low: 101, close: 106 },
  // ... más datos
];

<LightweightCandlestickChart
  data={data}
  height={400}
  showMA={true} // Mostrar media móvil
  maPeriod={7} // Período de la media móvil
  showVolume={false} // Mostrar volumen (requiere volumeData)
  title="Dólar Blue"
/>;
```

**Características:**

- ✅ Candlesticks con colores verdes (alza) y rojos (baja)
- ✅ Media móvil simple (SMA) configurable
- ✅ Volumen opcional como histograma
- ✅ Zoom y pan interactivo
- ✅ Crosshair para ver valores exactos
- ✅ Responsive

### 2. LightweightAreaChart

**Uso:** Gráficos de área con gradiente, ideal para precios de crypto.

```tsx
import { LightweightAreaChart } from '@/components/charts/LightweightAreaChart';

const data = [
  { time: 1642425600, value: 45000 },
  { time: 1642512000, value: 46500 },
  // ... más datos
];

<LightweightAreaChart
  data={data}
  height={300}
  color="#0047FF"
  showBaseline={true} // Mostrar profit/loss coloring
  baselineValue={45000} // Precio de referencia
  title="Bitcoin"
/>;
```

**Características:**

- ✅ Área con gradiente suave
- ✅ Modo "Baseline" que colorea en verde (ganancia) o rojo (pérdida)
- ✅ Totalmente customizable
- ✅ Performance excelente

### 3. DolarAreaChart (Componente Ready-to-Use) ⭐ RECOMENDADO

**Uso:** Area chart específico para dólar con baseline y controles integrados.

```tsx
import { DolarAreaChart } from '@/components/charts/DolarAreaChart';

<DolarAreaChart defaultCasa="blue" showCasaSelector={true} />;
```

**Características:**

- ✅ Selector de tipo de dólar (Blue, Oficial, MEP, CCL, Tarjeta)
- ✅ Selector de timeframe (7, 30, 90 días, Todo)
- ✅ Toggle para media móvil 7D
- ✅ Toggle para baseline (muestra profit/loss)
- ✅ Stats: precio actual, cambio % en el período
- ✅ Consume datos de `useMultipleDolarHistoricoRange` automáticamente
- ✅ Leyenda explicativa

**¿Por qué usar esto en lugar de candlesticks?**
El dólar argentino solo tiene un precio de cierre diario. El área chart con baseline es más honesto y útil para análisis técnico con datos diarios.

### 4. CryptoPriceChart (Componente Ready-to-Use)

**Uso:** Chart profesional para crypto con baseline.

```tsx
import { CryptoPriceChart } from '@/components/charts/CryptoPriceChart';

<CryptoPriceChart crypto={cryptoData} height={300} showBaseline={true} />;
```

**Características:**

- ✅ Usa datos de sparkline de CoinGecko (30 días)
- ✅ Baseline que muestra profit/loss vs precio inicial
- ✅ Header con precio actual y cambio porcentual
- ✅ Footer con stats (Market Cap, 24h High/Low)

## Dónde están integrados

### Página de Análisis (`/dashboard/analisis`)

- **DolarAreaChart** - Gráfico principal con baseline y selectors
- **InflacionLightweightChart** - Inflación mensual e interanual
- **RiesgoPaisLightweightChart** - Riesgo país con área gradient
- Ubicado antes de la sección de TradingView

### Dashboard Principal (`/dashboard`)

- **DolarAreaChart** en la sección "Análisis Avanzado"
- Permite a los usuarios explorar diferentes tipos de dólar sin salir del dashboard

## Próximos pasos sugeridos

### 1. Agregar más indicadores técnicos

```tsx
// Puedes calcular y agregar:
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- EMA (Exponential Moving Average)
```

### 2. Datos OHLC reales

```tsx
// En lugar de simular OHLC, obtener datos intraday:
- Crear endpoint que consulte múltiples cotizaciones por día
- Agrupar por día para obtener Open, High, Low, Close reales
```

### 3. Múltiples monedas comparadas

```tsx
// Mostrar varios dólares en el mismo gráfico:
<LightweightCandlestickChart>
  // Agregar múltiples series (blue, oficial, MEP, CCL) // Cada uno con su propio color
</LightweightCandlestickChart>
```

### 4. Websockets para real-time

```tsx
// Actualizar precios en tiempo real:
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/prices');
  ws.onmessage = (event) => {
    const newPrice = JSON.parse(event.data);
    candlestickSeries.update(newPrice);
  };
}, []);
```

### 5. Usar en más lugares

- **Dashboard principal:** Reemplazar sparklines con mini-versions de estos charts
- **Página de crypto:** Agregar CryptoPriceChart en modales de detalle
- **Favoritos:** Mostrar mini-chart al expandir

## Ventajas vs Recharts

| Feature              | Recharts     | Lightweight Charts    |
| -------------------- | ------------ | --------------------- |
| Candlesticks         | ❌ No nativo | ✅ Nativo             |
| Performance          | 🟡 Medio     | ✅ Excelente (Canvas) |
| Interactividad       | 🟡 Básica    | ✅ Avanzada           |
| Indicadores técnicos | ❌ Manual    | ✅ Fácil de agregar   |
| Bundle size          | 🟡 ~80KB     | ✅ ~50KB              |
| Zoom/Pan             | ❌ No        | ✅ Sí                 |
| Look profesional     | 🟡 Bueno     | ✅ Excelente          |

## Recursos

- **Docs oficiales:** https://tradingview.github.io/lightweight-charts/
- **Ejemplos:** https://tradingview.github.io/lightweight-charts/docs/examples
- **GitHub:** https://github.com/tradingview/lightweight-charts
- **NPM:** https://www.npmjs.com/package/lightweight-charts

## Soporte

Para dudas o problemas:

1. Revisar la documentación oficial
2. Buscar ejemplos en `/components/charts/`
3. Ver implementación en `/pages/dashboard/analisis.tsx`
