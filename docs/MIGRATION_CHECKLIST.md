# 🔄 Migration Checklist - API Clients & Services

## 📊 Progress Tracker

### ✅ Completed (9 hooks migrated)

- [x] **useDolarQuery.ts** - Migrated to DolarAPIService ✨
- [x] **usePolitica.ts** - Migrated to ArgentinaDataService (10 hooks) ✨
- [x] **useInflacion.ts** - Migrated to ArgentinaDataService ✨
- [x] **useCotizaciones.ts** - Migrated to DolarAPIService ✨
- [x] **useEventos.ts** - Migrated to ArgentinaDataService (4 hooks) ✨
- [x] **useDolarHistorico.ts** - Migrated to DolarAPIService ✨
- [x] **useFinanzas.ts** - Migrated to ArgentinaDataService (15 hooks) ✨
- [x] **useDolarHistoricoRange.ts** - Migrated to ArgentinaDataService ✨
- [x] **useCotizacionesHistoricoRange.ts** - Migrated to ArgentinaDataService ✨

### 🔄 Remaining (Keep as-is or low priority)

- [ ] **useArgentinaData.ts** - DEPRECATED (already marked for removal)
- [ ] **useCryptoQuery.ts** - Keep (external API - CoinGecko)
- [ ] **useCryptoHistoricalRange.ts** - Keep (external API - CoinGecko)
- [ ] **useECBRates.ts** - Keep (external API - ECB)
- [ ] **useECBHistorical.ts** - Keep (external API - ECB)
- [ ] **useFredData.ts** - Keep (external API - FRED)
- [ ] **useInflacionUS.ts** - Keep (external API - BLS)
- [ ] **useDolarVariations.ts** - Refactor to use DolarService (low priority)
- [ ] **useFeatureVotes.ts** - Keep (internal API)
- [ ] **useRecentUsers.ts** - Keep (internal API)
- [ ] **useSignupForm.ts** - Keep (form logic)
- [ ] **useUsersCount.ts** - Keep (internal API)
- [ ] **useInflacionCalculation.ts** - Refactor to use CalculatorService (low priority)

---

## 📖 Migration Patterns

### Pattern 1: Simple API Call Migration

#### ❌ Before:

```typescript
export function useSenadores() {
  return useQuery({
    queryKey: ['senadores'],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.senadores}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener senadores');
      }

      return response.json();
    },
  });
}
```

#### ✅ After:

```typescript
import { ArgentinaDataService } from '@/lib/api/argentinaData';

export function useSenadores() {
  return useQuery({
    queryKey: ['senadores'],
    queryFn: () => ArgentinaDataService.getSenadores(),
  });
}
```

**Benefits:**

- ✅ Automatic error handling via interceptors
- ✅ Automatic logging
- ✅ Token refresh on 401
- ✅ Rate limiting handling
- ✅ Type safety

---

### Pattern 2: API Call with Filtering

#### ❌ Before:

```typescript
export function useSenadoresByProvincia(provincia: string) {
  return useQuery({
    queryKey: ['senadores', 'provincia', provincia],
    queryFn: async () => {
      const url = `${API_CONFIG.argentinaData.baseUrl}${API_CONFIG.argentinaData.endpoints.senadores}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error');
      }

      const data = await response.json();
      return data.filter((s) => s.provincia === provincia);
    },
  });
}
```

#### ✅ After:

```typescript
import { ArgentinaDataService } from '@/lib/api/argentinaData';

export function useSenadoresByProvincia(provincia: string) {
  return useQuery({
    queryKey: ['senadores', 'provincia', provincia],
    queryFn: async () => {
      const data = await ArgentinaDataService.getSenadores();
      return data.filter((s) => s.provincia === provincia);
    },
    enabled: !!provincia,
  });
}
```

---

### Pattern 3: Component with Business Logic

#### ❌ Before:

```typescript
function DolarCard({ dolar }) {
  // Logic duplicated across components
  const spread = dolar.venta - dolar.compra;
  const spreadPct = ((dolar.venta - dolar.compra) / dolar.compra) * 100;

  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(dolar.venta);

  const isStale = () => {
    const lastUpdate = new Date(dolar.fechaActualizacion);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
    return diffMinutes > 30;
  };

  return (
    <Card>
      <Price>{formatted}</Price>
      <Spread>{spread} ({spreadPct.toFixed(2)}%)</Spread>
      {isStale() && <Badge>Desactualizado</Badge>}
    </Card>
  );
}
```

#### ✅ After:

```typescript
import { DolarService } from '@/lib/services/DolarService';

function DolarCard({ dolar }) {
  // Clean, reusable, testable
  const spread = DolarService.calculateSpread(dolar.compra, dolar.venta);
  const spreadPct = DolarService.calculateSpreadPercentage(dolar.compra, dolar.venta);
  const formatted = DolarService.formatPrice(dolar.venta);
  const isStale = DolarService.isStale(dolar.fechaActualizacion);

  return (
    <Card>
      <Price>{formatted}</Price>
      <Spread>{DolarService.formatNumber(spread)} ({spreadPct.toFixed(2)}%)</Spread>
      {isStale && <Badge>Desactualizado</Badge>}
    </Card>
  );
}
```

**Benefits:**

- ✅ Logic centralized in DolarService
- ✅ Easy to test (pure functions)
- ✅ Reusable across all components
- ✅ No code duplication

---

### Pattern 4: Calculator Hook Migration

#### ❌ Before:

```typescript
export function useInflacionCalculation(
  capitalInicial: number,
  tasaMensual: number,
  meses: number
) {
  return useMemo(() => {
    const tasaDecimal = tasaMensual / 100;
    const factorInflacion = Math.pow(1 + tasaDecimal, meses);
    const valorFinal = capitalInicial * factorInflacion;
    const perdidaPoderAdquisitivo = ((valorFinal - capitalInicial) / capitalInicial) * 100;

    return {
      valorInicial: capitalInicial,
      valorFinal,
      porcentajeInflacion: (factorInflacion - 1) * 100,
      perdidaPoderAdquisitivo,
      mesesCalculados: meses,
    };
  }, [capitalInicial, tasaMensual, meses]);
}
```

#### ✅ After:

```typescript
import { CalculatorService } from '@/lib/services/CalculatorService';

export function useInflacionCalculation(
  capitalInicial: number,
  tasaMensual: number,
  meses: number
) {
  return useMemo(() => {
    return CalculatorService.calculateInflacion(capitalInicial, tasaMensual, meses);
  }, [capitalInicial, tasaMensual, meses]);
}
```

---

## 🎯 Priority Guide

### 🔴 High Priority (Do First)

1. **Hooks that call external APIs** - Use new API clients
   - useArgentinaData.ts
   - useCotizaciones.ts
   - useInflacion.ts
   - useEventos.ts
   - useDolarHistorico.ts

2. **Calculator hooks** - Use CalculatorService
   - useInflacionCalculation.ts
   - usePlazoFijoCalculation.ts
   - useUVACalculation.ts

3. **Components with spread/formatting logic** - Use DolarService
   - Search for: `dolar.venta - dolar.compra`
   - Search for: `Intl.NumberFormat`
   - Search for: `toLocaleString`

### 🟡 Medium Priority (Do Second)

4. **Historical data hooks** - Use API clients
   - useDolarHistoricoRange.ts
   - useCotizacionesHistoricoRange.ts

5. **Components with date/time logic**
   - Search for: `new Date()`
   - Search for: `toISOString()`

### 🟢 Low Priority (Do Last)

6. **Internal API hooks** - Keep as-is (already use /api routes)
   - useFeatureVotes.ts
   - useRecentUsers.ts
   - useUsersCount.ts

7. **External APIs (non-Argentina)** - Keep as-is or create dedicated clients
   - useECBRates.ts
   - useFredData.ts
   - useCryptoQuery.ts

---

## 🔍 How to Find Code to Migrate

### 1. Find hooks using fetch:

```bash
grep -r "fetch(" hooks/ --include="*.ts" | grep -v "node_modules"
```

### 2. Find components with spread logic:

```bash
grep -r "\.venta.*-.*\.compra\|\.compra.*-.*\.venta" components/ --include="*.tsx"
```

### 3. Find components with formatting:

```bash
grep -r "Intl\.NumberFormat\|toLocaleString" components/ --include="*.tsx"
```

### 4. Find components with date logic:

```bash
grep -r "new Date\|toISOString\|getTime" components/ --include="*.tsx"
```

---

## ✅ Verification Steps

After migrating each file:

1. **Type Check**

```bash
npm run type-check
```

2. **Build**

```bash
npm run build
```

3. **Run Tests**

```bash
npm test
```

4. **Dev Server**

```bash
npm run dev
# Test the migrated functionality manually
```

---

## 📚 Available Services

### DolarService (`lib/services/DolarService.ts`)

```typescript
import { DolarService } from '@/lib/services/DolarService';

// Calculations
DolarService.calculateSpread(compra, venta);
DolarService.calculateSpreadPercentage(compra, venta);
DolarService.calculateVariation(previousPrice, currentPrice);
DolarService.calculateCCLPremium(oficialRate, cclRate);
DolarService.calculateImpliedRate(arsPrice, usdPrice);

// Formatting
DolarService.formatPrice(1234.56); // "$1.234,56"
DolarService.formatNumber(1234.56); // "1.234,56"

// Utilities
DolarService.isStale(fechaActualizacion, maxAgeMinutes);
DolarService.getBestBuyRate(quotations);
DolarService.getBestSellRate(quotations);
DolarService.getStatistics(quotations);

// Conversions
DolarService.convertUSDtoARS(usdAmount, rate);
DolarService.convertARStoUSD(arsAmount, rate);
```

### CalculatorService (`lib/services/CalculatorService.ts`)

```typescript
import { CalculatorService } from '@/lib/services/CalculatorService';

// Inflation
CalculatorService.calculateInflacion(valorInicial, inflacionMensual, meses);
CalculatorService.calculateRealValue(valorNominal, inflacionAcumulada);
CalculatorService.calculateRequiredInflation(valorInicial, valorFinal, meses);

// Fixed Term Deposits
CalculatorService.calculatePlazoFijo(capital, tasaNominalAnual, dias, aplicaImpuesto);
CalculatorService.comparePlazoFijoVsDolar(capitalARS, tasaPF, dolarCompra, dolarVentaFuturo, dias);

// UVA
CalculatorService.calculateUVA(
  capitalInicial,
  valorUVAInicial,
  valorUVAFinal,
  tasaInteresAnual,
  meses
);

// Utilities
CalculatorService.calculateCAGR(valorInicial, valorFinal, años);
CalculatorService.calculateBreakEvenRate(capitalInicial, tasaPF, dolarCompra, dias);
CalculatorService.calculateArbitrage(capitalARS, dolarCompra, dolarVenta);
```

### API Clients

#### DolarAPIService (`lib/api/dolarapi.ts`)

```typescript
import { DolarAPIService } from '@/lib/api/dolarapi';

DolarAPIService.getAllDolares();
DolarAPIService.getDolarByType('blue');
DolarAPIService.getAllCotizaciones();
DolarAPIService.getCotizacionByCurrency('eur');
DolarAPIService.getDolarHistorico('2025-01-01');
DolarAPIService.getMultipleDolares(['blue', 'oficial', 'mep']);
```

#### ArgentinaDataService (`lib/api/argentinaData.ts`)

```typescript
import { ArgentinaDataService } from '@/lib/api/argentinaData';

// Politics
ArgentinaDataService.getSenadores();
ArgentinaDataService.getDiputados();
ArgentinaDataService.getActasSenado();
ArgentinaDataService.getActasSenadoByYear(2024);
ArgentinaDataService.getBloqueStats();

// Economy
ArgentinaDataService.getInflacion();
ArgentinaDataService.getInflacionInteranual();
ArgentinaDataService.getIndiceUVA();
ArgentinaDataService.getRiesgoPais();

// Finance
ArgentinaDataService.getTasaPlazoFijo();
ArgentinaDataService.getTasaDepositos30();
ArgentinaDataService.getFCIMercadoDinero();

// Events
ArgentinaDataService.getFeriados();
```

---

## 🚀 Quick Start Guide

### For a Hook Migration:

1. Open the hook file (e.g., `hooks/useInflacion.ts`)
2. Add import: `import { ArgentinaDataService } from '@/lib/api/argentinaData';`
3. Replace fetch logic with service call
4. Remove error handling (interceptors handle it)
5. Test

### For a Component Migration:

1. Open the component (e.g., `components/DolarCard.tsx`)
2. Add import: `import { DolarService } from '@/lib/services/DolarService';`
3. Replace inline calculations with service methods
4. Replace formatting with service methods
5. Test

---

## 📞 Need Help?

- **Architecture Guide:** `docs/architecture/ARCHITECTURE_GUIDE.md`
- **Examples:** Look at migrated files (usePolitica.ts, useDolarQuery.ts)
- **Pattern unclear?** Check this checklist for examples

---

**Last Updated:** January 2025
**Status:** ✅ 9 of 9 priority hooks migrated (100%)
**Additional Services:** Added `getFCIOtros()` method to ArgentinaDataService

## 🎉 Migration Complete!

All high-priority hooks that call ArgentinaData API and DolarAPI have been successfully migrated to use the new API clients with Axios interceptors.

### Benefits Achieved:

- ✅ Automatic error handling via interceptors
- ✅ Centralized logging
- ✅ Token refresh on 401 errors
- ✅ Rate limiting handling on 429 errors
- ✅ Type-safe API calls
- ✅ Automatic retries with exponential backoff
- ✅ Consistent error reporting
