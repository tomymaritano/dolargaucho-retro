# 🧪 Manual de Testing - Páginas Dashboard

## 📋 Checklist de Testing Manual

### ✅ Cómo usar este documento:

1. Abre cada página en el navegador
2. Sigue los pasos de testing
3. Marca ✅ si funciona, ❌ si hay error
4. Anota cualquier observación

---

## 1. 🏠 Dashboard Principal (`/dashboard`)

### Tests Funcionales:

- [ ] **Carga inicial**
  - Verifica que se carguen las cotizaciones del dólar
  - Verifica que se muestren los favoritos (si hay)
  - Verifica que no haya errores en consola

- [ ] **Funcionalidad de Favoritos**
  - Agregar un dólar a favoritos (click en estrella)
  - Remover un dólar de favoritos
  - Verificar que persiste en localStorage
  - Verificar que se muestre el contador correcto

- [ ] **Interacción**
  - Hover sobre cards muestra efecto visual
  - Los valores se actualizan cada 30 segundos
  - Los botones son clickeables

### Tests de UI:

- [ ] Responsive design funciona en móvil
- [ ] Loading states aparecen correctamente
- [ ] Empty states si no hay datos

---

## 2. ⭐ Favoritos (`/dashboard/favoritos`)

### Tests Funcionales:

- [ ] **Listado de favoritos**
  - Se muestran solo los items marcados como favoritos
  - Se puede remover de favoritos
  - Mensaje si no hay favoritos

- [ ] **Persistencia**
  - Los favoritos persisten al recargar
  - Los favoritos se sincronizan entre páginas

---

## 3. 📊 Análisis (`/dashboard/analisis`)

### Tests Funcionales:

- [ ] **Métricas principales**
  - Brecha cambiaria calcula correctamente
  - Inflación mensual se muestra
  - Riesgo país se muestra

- [ ] **Gráficos**
  - Gráfico de inflación renderiza
  - Gráfico de riesgo país renderiza
  - Tooltips funcionan al hacer hover
  - Leyendas son visibles

- [ ] **Comparativa de dólares**
  - Se muestran todos los tipos de dólar
  - Cálculo de brecha vs oficial correcto

### Tests de Datos:

- [ ] Valores numéricos tienen formato correcto
- [ ] Fechas se muestran correctamente
- [ ] Porcentajes calculados bien

---

## 4. 🏛️ Política (`/dashboard/politica`)

### Tests Funcionales:

- [ ] **Tabs de navegación**
  - Tab "Senadores" funciona
  - Tab "Diputados" funciona
  - Tab "Actas" funciona

- [ ] **Tabla de Senadores**
  - Se cargan los datos
  - Búsqueda funciona
  - Filtros funcionan (provincia, bloque)
  - Ordenamiento funciona
  - Paginación funciona

- [ ] **Tabla de Diputados**
  - Se cargan los datos
  - Búsqueda funciona
  - Filtros funcionan
  - Ordenamiento funciona

- [ ] **Estadísticas**
  - Gráficos de bloques renderiza
  - Números son correctos
  - Porcentajes calculados bien

---

## 5. 💰 Finanzas (`/dashboard/finanzas`)

### Tests Funcionales:

- [ ] **Tabs de navegación**
  - Tab "Índices Económicos" funciona
  - Tab "Tasas de Interés" funciona
  - Tab "Fondos Comunes (FCI)" funciona

- [ ] **Quick Stats**
  - Inflación mensual se muestra
  - Riesgo país se muestra
  - Índice UVA se muestra
  - Tasa plazo fijo se muestra

- [ ] **Gráficos de Índices**
  - Gráfico inflación (mensual e interanual)
  - Gráfico riesgo país histórico

- [ ] **Gráfico de Tasas**
  - Gráfico de barras TNA por plazo
  - Colores diferenciados por plazo
  - Leyenda visible

- [ ] **FCI Browser**
  - Se cargan los fondos
  - Filtros funcionan (tipo, moneda, clase)
  - Búsqueda funciona
  - Tabla muestra datos correctos
  - Paginación (50 primeros)

---

## 6. 🧮 Calculadoras (`/dashboard/calculadoras`)

### Tests Funcionales:

#### Calculadora Plazo Fijo:

- [ ] Input de capital acepta números
- [ ] Formato de número con puntos (separador de miles)
- [ ] Selección de plazo (botones + input manual)
- [ ] Radio buttons de tasa (actual vs personalizada)
- [ ] Cálculo de TNA y TEA correcto
- [ ] Cálculo de interés correcto
- [ ] Resultados se muestran formateados

#### Calculadora UVA:

- [ ] Input de capital funciona
- [ ] Cálculo UVA correcto
- [ ] Resultados formateados

#### Conversor Crypto:

- [ ] Selección de crypto funciona
- [ ] Conversión a ARS correcta
- [ ] Cotizaciones actualizadas

#### Conversor Moneda:

- [ ] Selección de moneda funciona
- [ ] Conversión correcta
- [ ] Formato de resultados

---

## 7. 🔔 Alertas (`/dashboard/alertas`)

### Tests Funcionales:

- [ ] **Formulario de alerta**
  - Selección de tipo de dólar
  - Input de valor umbral
  - Selección de condición (mayor/menor)
  - Selección de notificación (email/push)
  - Botón guardar funciona

- [ ] **Lista de alertas**
  - Se muestran las alertas guardadas
  - Se puede editar una alerta
  - Se puede eliminar una alerta
  - Estado activo/inactivo toggle

- [ ] **Persistencia**
  - Alertas persisten en localStorage
  - Se sincronizan entre sesiones

---

## 8. 📅 Calendario (`/dashboard/calendario`)

### Tests Funcionales:

- [ ] **Vista mensual**
  - Calendario renderiza correctamente
  - Mes actual seleccionado
  - Navegación entre meses funciona
  - Días con eventos resaltados

- [ ] **Próximos eventos**
  - Lista de eventos futuros
  - Feriados se muestran
  - Eventos presidenciales (si disponible)

- [ ] **Filtros**
  - Filtro por tipo de evento
  - Búsqueda funciona

---

## 🎨 Tests Globales de UI/UX

### En todas las páginas:

#### Layout & Navegación:

- [ ] Sidebar se muestra/oculta en móvil
- [ ] Items del menú tienen highlight activo
- [ ] Logo clickeable vuelve al dashboard
- [ ] Quick stats en sidebar se actualizan

#### Responsive:

- [ ] Desktop (>1024px) - Layout completo
- [ ] Tablet (768px-1024px) - Layout adaptado
- [ ] Mobile (<768px) - Layout móvil

#### Estados:

- [ ] Loading spinners aparecen mientras carga
- [ ] Error messages si falla API
- [ ] Empty states si no hay datos
- [ ] Skeleton loaders (opcional)

#### Performance:

- [ ] Tiempo de carga inicial < 3s
- [ ] Navegación entre páginas fluida
- [ ] No memory leaks (check DevTools)
- [ ] Imágenes optimizadas

---

## 🔍 Tests de Consola

Abrir DevTools Console y verificar:

### Errores a buscar:

- [ ] ❌ No hay errores 404 (APIs)
- [ ] ❌ No hay errores de React (warnings)
- [ ] ❌ No hay memory leaks
- [ ] ❌ No hay CORS errors
- [ ] ❌ No hay PropType warnings

### Network:

- [ ] Requests exitosos (200 OK)
- [ ] No requests redundantes
- [ ] Cache funciona (ver headers)

---

## 📊 Reporte de Bugs

### Template para reportar bugs:

```markdown
### 🐛 Bug: [Título descriptivo]

**Página**: /dashboard/[nombre]
**Severidad**: Alta / Media / Baja
**Navegador**: Chrome/Firefox/Safari

**Pasos para reproducir**:

1. Ir a...
2. Click en...
3. ...

**Comportamiento esperado**:
[Qué debería pasar]

**Comportamiento actual**:
[Qué pasa realmente]

**Screenshots**:
[Adjuntar si es posible]

**Error en consola**:
```

[Copiar error de consola]

```

```

---

## ✅ Checklist Final

### Antes de dar por completado:

- [ ] Todas las páginas testeadas
- [ ] Todos los botones funcionan
- [ ] Todos los filtros funcionan
- [ ] Todos los gráficos renderizan
- [ ] No hay errores en consola
- [ ] Responsive funciona
- [ ] Performance aceptable
- [ ] Bugs documentados

---

## 📝 Notas de Testing

### Página testeada: **\*\***\_\_\_**\*\***

### Fecha: **\*\***\_\_\_**\*\***

### Testeado por: **\*\***\_\_\_**\*\***

### Resultados:

- ✅ Passed: **_ / _**
- ❌ Failed: **_ / _**
- ⚠️ Warnings: **_ / _**

### Observaciones:

```
[Escribe aquí cualquier observación]
```

---

**Última Actualización**: 2025-10-08
**Versión**: 1.0.0
