# Auditoría de Componentes React - Principios de Diseño

## 📋 Principios de Diseño a Evaluar

1. **Single Responsibility Principle (SRP)** - Cada componente debe tener una sola responsabilidad
2. **Composition over Inheritance** - Preferir composición sobre herencia
3. **Declarative, Not Imperative** - Código declarativo y fácil de leer
4. **Controlled Data Flow (Unidirectional)** - Flujo de datos unidireccional predecible
5. **State Minimalism** - Minimizar estado, derivar cuando sea posible
6. **Hooks Correctamente Estructurados** - Custom hooks para lógica reutilizable
7. **Prop Interfaces Claras** - TypeScript con interfaces bien definidas
8. **Styling Consistente** - Sistema de diseño consistente
9. **Performance y Memoization** - useMemo, useCallback, React.memo cuando corresponde
10. **Accesibilidad (A11y)** - Semantic HTML, ARIA labels, keyboard navigation
11. **Testing y Documentación** - Tests unitarios y documentación clara
12. **Predictable Naming & Folder Structure** - Nombres claros y estructura predecible
13. **Design-System Thinking** - Componentes reutilizables que forman un sistema

---

## 🎯 COMPONENTES A AUDITAR

### ✅ UI Components (Sistema de Diseño)

#### `components/ui/Button/Button.tsx`
- [ ] SRP
- [ ] Composition
- [ ] Props claros
- [ ] Styling consistente
- [ ] Variants bien definidos
- [ ] A11y (aria-labels, keyboard)
- [ ] Performance (React.memo si necesario)

#### `components/ui/Card/Card.tsx`
- [ ] SRP
- [ ] Composition (Card.Header, Card.Content, Card.Footer)
- [ ] Props claros
- [ ] Styling consistente
- [ ] Variants bien definidos

#### `components/ui/Input/Input.tsx`
- [ ] SRP
- [ ] Controlled component
- [ ] Props claros
- [ ] A11y (labels, aria-describedby)
- [ ] Error states
- [ ] Validation

#### ✅ **`components/ui/Table/Table.tsx`** (RECIÉN CREADO)
- [x] SRP - Cada subcomponente tiene una responsabilidad
- [x] Composition - Table, TableHeader, TableBody, TableRow, TableCell
- [x] Props claros - TypeScript interfaces bien definidas
- [x] Styling consistente - Sistema unificado
- [x] Loading states - Skeleton loader
- [x] Empty states - Mensaje personalizable
- [x] A11y - Semantic HTML, aria-labels

#### `components/ui/NavbarPro/NavbarPro.tsx`
- [ ] SRP
- [ ] Composition
- [ ] Responsive design
- [ ] A11y (navigation, mobile menu)
- [ ] Performance (memoization)

#### `components/ui/Aurora/Aurora.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Performance (animaciones optimizadas)

#### `components/ui/DisclaimerBanner/DisclaimerBanner.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] A11y (dismissible)

#### `components/ui/DolarMarquee/DolarMarquee.tsx`
- [ ] SRP
- [ ] Performance (scroll infinito optimizado)
- [ ] Responsive

#### `components/ui/ElectricBorder/ElectricBorder.tsx`
- [ ] SRP
- [ ] Performance (animaciones CSS)

#### `components/ui/GlobalSearch/GlobalSearch.tsx`
- [ ] SRP
- [ ] State management
- [ ] Performance (debouncing)
- [ ] A11y (keyboard navigation, focus management)

#### `components/ui/HelpButton/HelpButton.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] A11y (modal, focus trap)

#### `components/ui/RiesgoPaisBadge/RiesgoPaisBadge.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Styling consistente

#### `components/ui/ThemeToggle/ThemeToggle.tsx`
- [ ] SRP
- [ ] State management (theme context)
- [ ] A11y (button labels)

#### `components/ui/Tooltip/Tooltip.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] A11y (aria-describedby)
- [ ] Performance (portal rendering)

---

### 📊 Chart Components

#### `components/charts/CryptoSparkline.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Performance (Recharts optimizado)
- [ ] Responsive
- [ ] Empty states

#### `components/charts/FredChart.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Performance
- [ ] Responsive
- [ ] A11y (chart labels, descriptions)

#### `components/charts/InflacionChart.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Performance
- [ ] Responsive

#### `components/charts/RiesgoPaisChart.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Performance
- [ ] Responsive

#### `components/charts/TasasChart.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Performance
- [ ] Responsive

---

### 📈 Table Components

#### ✅ **`components/tables/DolaresTable.tsx`** (ACTUALIZADO)
- [x] SRP - Solo maneja visualización de dólares
- [x] Composition - Usa componentes de Table unificados
- [x] Hooks estructurados - useMultipleDolarHistoricoRange
- [x] State minimalism - useMemo para sorting
- [x] Props claros - TypeScript interfaces
- [x] Performance - useMemo para sortedDolares
- [x] A11y - Semantic table, aria-labels

#### ✅ **`components/tables/CotizacionesTable.tsx`** (ACTUALIZADO)
- [x] SRP - Solo maneja visualización de cotizaciones
- [x] Composition - Usa componentes de Table unificados
- [x] Hooks estructurados - useMultipleCotizacionesHistoricoRange
- [x] State minimalism - useMemo para sorting
- [x] Props claros - TypeScript interfaces
- [x] Performance - useMemo para sortedCotizaciones
- [x] A11y - Semantic table, aria-labels

---

### 🏛️ Política Components

#### `components/politica/DiputadosTable.tsx`
- [ ] SRP
- [ ] **MIGRAR A NUEVO SISTEMA DE TABLAS** (Table, TableRow, TableCell)
- [ ] Hooks estructurados
- [ ] State management (filters, pagination)
- [ ] Performance (pagination, useMemo)

#### `components/politica/SenadoresTable.tsx`
- [ ] SRP
- [ ] **MIGRAR A NUEVO SISTEMA DE TABLAS**
- [ ] Hooks estructurados
- [ ] State management
- [ ] Performance

#### `components/politica/ActasDiputados.tsx`
- [ ] SRP
- [ ] Hooks estructurados
- [ ] Props claros

#### `components/politica/ActasSenado.tsx`
- [ ] SRP
- [ ] Hooks estructurados
- [ ] Props claros

#### `components/politica/ActasUnificadas.tsx`
- [ ] SRP
- [ ] Composition
- [ ] Props claros

#### `components/politica/BloqueStatsCard.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Styling consistente

---

### 🧮 Calculadoras Components

#### `components/calculadoras/CalculadoraInflacion.tsx`
- [ ] SRP - REVISAR (puede ser muy grande)
- [ ] State management (formulario)
- [ ] Validation
- [ ] Props claros

#### `components/calculadoras/CalculadoraPlazoFijo.tsx`
- [ ] SRP - REVISAR
- [ ] State management
- [ ] Validation
- [ ] Props claros

#### `components/calculadoras/CalculadoraUVA.tsx`
- [ ] SRP - REVISAR
- [ ] State management
- [ ] Validation
- [ ] Props claros

#### `components/calculadoras/CalculadoraActivos/`
- [ ] Folder structure
- [ ] SRP por componente
- [ ] Composition

#### `components/calculadoras/CalculatorLayout.tsx`
- [ ] SRP
- [ ] Composition
- [ ] Props claros

#### `components/calculadoras/MegaCalculadora.tsx`
- [ ] SRP - REVISAR (nombre sugiere componente muy grande)
- [ ] State management
- [ ] Separar en componentes más pequeños?

#### `components/calculadoras/FinancialCalculator.tsx`
- [ ] SRP
- [ ] State management
- [ ] Props claros

#### `components/calculadoras/conversorcrypto.tsx`
- [ ] **RENOMBRAR a PascalCase: `ConversorCrypto.tsx`**
- [ ] SRP
- [ ] State management

#### `components/calculadoras/conversormoneda.tsx`
- [ ] **RENOMBRAR a PascalCase: `ConversorMoneda.tsx`**
- [ ] SRP
- [ ] State management

#### `components/calculadoras/ipcipm.tsx`
- [ ] **RENOMBRAR a PascalCase: `IpcIpm.tsx`**
- [ ] SRP
- [ ] Props claros

---

### 🪙 Crypto Components

#### `components/crypto/` (carpeta)
- [ ] Revisar estructura
- [ ] Componentes dentro
- [ ] Naming conventions

---

### 📅 Calendario Components

#### `components/calendario/CalendarioMensual.tsx`
- [ ] SRP
- [ ] State management (mes actual, navegación)
- [ ] Props claros
- [ ] A11y (keyboard navigation de fechas)

#### `components/calendario/ProximosEventos.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Styling consistente

---

### 🔔 Alertas Components

#### `components/alertas/AlertForm.tsx`
- [ ] SRP
- [ ] State management (formulario)
- [ ] Validation
- [ ] Props claros
- [ ] A11y (form labels, errors)

#### `components/alertas/AlertsList.tsx`
- [ ] SRP
- [ ] Props claros
- [ ] Styling consistente

---

### 🏗️ Layout Components

#### `components/layouts/DashboardLayout.tsx`
- [ ] SRP
- [ ] Composition (children)
- [ ] Responsive
- [ ] A11y (navigation landmarks)

#### `components/layouts/UnifiedNavbar.tsx`
- [ ] SRP
- [ ] Composition
- [ ] Responsive
- [ ] A11y

---

### 🧱 Legacy/Old Components (POSIBLE ELIMINACIÓN)

#### `components/dolarcomponent.tsx`
- [ ] **RENOMBRAR o ELIMINAR**
- [ ] Duplicado con otros componentes?

#### `components/dolartable.tsx`
- [ ] **MIGRAR A NUEVO SISTEMA DE TABLAS o ELIMINAR**
- [ ] Duplicado?

#### `components/currencyconverter.tsx`
- [ ] **RENOMBRAR a PascalCase**
- [ ] Duplicado con conversormoneda?

#### `components/exchangerates.tsx`
- [ ] **RENOMBRAR a PascalCase**
- [ ] SRP

#### `components/chatbot.tsx`
- [ ] **RENOMBRAR a PascalCase: `ChatBot.tsx`**
- [ ] SRP
- [ ] State management

#### `components/contactform.tsx`
- [ ] **RENOMBRAR a PascalCase: `ContactForm.tsx`**
- [ ] SRP
- [ ] Validation

#### `components/faqs.tsx`
- [ ] **RENOMBRAR a PascalCase: `Faqs.tsx`**
- [ ] SRP
- [ ] Composition

#### `components/footer.tsx`
- [ ] **RENOMBRAR a PascalCase: `Footer.tsx`**
- [ ] SRP

#### `components/hero.tsx`
- [ ] **RENOMBRAR a PascalCase: `Hero.tsx`**
- [ ] SRP

#### `components/navbar.tsx`
- [ ] **RENOMBRAR a PascalCase: `Navbar.tsx`**
- [ ] Duplicado con NavbarPro o UnifiedNavbar?

#### `components/riskcomponent.tsx`
- [ ] **RENOMBRAR a PascalCase: `RiskComponent.tsx`**
- [ ] Duplicado con RiesgoPaisBadge?

#### `components/toast.tsx`
- [ ] **RENOMBRAR a PascalCase: `Toast.tsx`**
- [ ] SRP
- [ ] Props claros

---

### 🧩 Other Components

#### `components/CotizacionesInternacionales.tsx`
- [ ] SRP
- [ ] Usa CotizacionesTable?
- [ ] Props claros

#### `components/DolarDashboard.tsx`
- [ ] SRP
- [ ] Composition
- [ ] Usa DolaresTable?

#### `components/ErrorBoundary.tsx`
- [ ] SRP
- [ ] Error handling
- [ ] Logging

#### `components/LeadCaptureForm.tsx`
- [ ] SRP
- [ ] Validation
- [ ] A11y

#### `components/aviso-legal.tsx`
- [ ] **RENOMBRAR a PascalCase: `AvisoLegal.tsx`**
- [ ] SRP

---

## 🎣 HOOKS PERSONALIZADOS

### Data Fetching Hooks

#### `hooks/useDolar.ts`
- [ ] SRP - Solo fetch de dólares
- [ ] TanStack Query correctamente
- [ ] Error handling
- [ ] Loading states

#### `hooks/useDolarQuery.ts`
- [ ] SRP
- [ ] TanStack Query
- [ ] TypeScript types

#### `hooks/useDolarHistorico.ts`
- [ ] SRP
- [ ] TanStack Query
- [ ] Caching strategy

#### ✅ **`hooks/useDolarHistoricoRange.ts`** (RECIÉN CREADO)
- [x] SRP - Fetch histórico de múltiples dólares
- [x] TanStack Query - Correctamente implementado
- [x] Performance - Promise.all para múltiples fetches
- [x] Error handling

#### `hooks/useDolarVariations.ts`
- [ ] SRP
- [ ] Derived state (calculado from other hooks)

#### `hooks/useCotizaciones.ts`
- [ ] SRP
- [ ] TanStack Query
- [ ] Types

#### ✅ **`hooks/useCotizacionesHistoricoRange.ts`** (RECIÉN CREADO)
- [x] SRP
- [x] TanStack Query
- [x] Performance

#### `hooks/useCryptoQuery.ts`
- [ ] SRP
- [ ] TanStack Query
- [ ] Pagination

#### `hooks/useArgentinaData.ts`
- [ ] SRP
- [ ] TanStack Query

#### `hooks/useFinanzas.ts`
- [ ] SRP
- [ ] TanStack Query

#### `hooks/useFredData.ts`
- [ ] SRP
- [ ] TanStack Query
- [ ] Error handling

#### `hooks/useECBRates.ts`
- [ ] SRP
- [ ] TanStack Query

#### `hooks/useECBHistorical.ts`
- [ ] SRP
- [ ] TanStack Query

#### `hooks/useInflacion.ts`
- [ ] SRP
- [ ] TanStack Query

#### `hooks/useInflacionUS.ts`
- [ ] SRP
- [ ] TanStack Query

### UI Hooks

#### `hooks/useToast.ts`
- [ ] SRP
- [ ] State management
- [ ] Return type claro

#### `hooks/useFuzzySearch.ts`
- [ ] SRP
- [ ] Performance (debouncing?)

---

## 📦 STORE/STATE MANAGEMENT

#### `lib/store/favorites.ts`
- [ ] SRP
- [ ] Zustand correctamente
- [ ] Persistence (localStorage)
- [ ] Types

---

## 🔧 UTILS

#### `lib/utils/storage.ts`
- [ ] SRP - Solo operaciones de storage
- [ ] Type safety
- [ ] Error handling

#### `lib/utils/formatters.ts`
- [ ] SRP - Solo formateo
- [ ] Pure functions
- [ ] Types

#### `lib/utils/logger.ts`
- [ ] SRP - Solo logging
- [ ] Levels (info, warn, error)

#### `lib/utils/rateLimit.ts`
- [ ] SRP
- [ ] Performance

---

## 🚨 TAREAS PRIORITARIAS

### 1. **Renaming a PascalCase** (ALTA PRIORIDAD)
Todos los componentes en camelCase deben renombrarse:
- `chatbot.tsx` → `ChatBot.tsx`
- `contactform.tsx` → `ContactForm.tsx`
- `currencyconverter.tsx` → `CurrencyConverter.tsx`
- `exchangerates.tsx` → `ExchangeRates.tsx`
- `faqs.tsx` → `Faqs.tsx`
- `footer.tsx` → `Footer.tsx`
- `hero.tsx` → `Hero.tsx`
- `navbar.tsx` → `Navbar.tsx`
- `riskcomponent.tsx` → `RiskComponent.tsx`
- `toast.tsx` → `Toast.tsx`
- `aviso-legal.tsx` → `AvisoLegal.tsx`
- `dolarcomponent.tsx` → `DolarComponent.tsx`
- `dolartable.tsx` → `DolarTable.tsx`
- Calculadoras:
  - `conversorcrypto.tsx` → `ConversorCrypto.tsx`
  - `conversormoneda.tsx` → `ConversorMoneda.tsx`
  - `ipcipm.tsx` → `IpcIpm.tsx`

### 2. **Migrar a Nuevo Sistema de Tablas** (ALTA PRIORIDAD)
- `DiputadosTable.tsx` → Usar Table, TableRow, TableCell
- `SenadoresTable.tsx` → Usar Table, TableRow, TableCell
- `dolartable.tsx` → Eliminar o migrar (posible duplicado)
- Cualquier otra tabla custom en el proyecto

### 3. **Eliminar Código No Usado** (ALTA PRIORIDAD)
- Archivos de Supabase (no se está usando)
- Componentes duplicados
- Legacy components que ya no se usan

### 4. **Separar Componentes Grandes** (MEDIA PRIORIDAD)
- `MegaCalculadora.tsx` - Probablemente muy grande
- Calculadoras complejas - Separar en componentes más pequeños

### 5. **Mejorar Performance** (MEDIA PRIORIDAD)
- Agregar React.memo donde corresponde
- Agregar useMemo/useCallback en componentes pesados
- Optimizar re-renders

### 6. **Mejorar Accesibilidad** (MEDIA PRIORIDAD)
- Agregar aria-labels faltantes
- Mejorar keyboard navigation
- Focus management en modals y forms

### 7. **Testing** (BAJA PRIORIDAD)
- Escribir tests para componentes críticos
- Testing de hooks personalizados
- Integration tests

---

## 📝 NOTAS

- Este documento debe actualizarse a medida que se completen las tareas
- Marcar con ✅ los componentes auditados y refactorizados
- Documentar decisiones de diseño importantes
- Mantener consistencia en todo el proyecto

---

**Última actualización:** 2025-10-14
**Estado:** Inicial - Sistema de Tablas Unificado Completado
