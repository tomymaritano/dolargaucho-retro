# 📋 Guía del Sistema de Changelog

## ¿Qué es esto?

Un sistema automático que muestra un modal elegante a los usuarios cuando hay actualizaciones importantes en el sitio.

## 🎯 Cómo funciona

1. **Automático**: Se muestra 1 segundo después de que el usuario carga la página
2. **Inteligente**: Solo aparece si hay versiones nuevas que el usuario no ha visto
3. **Persistente**: Usa localStorage para recordar qué versión vio el usuario
4. **No invasivo**: Aparece solo una vez por versión

## 📝 Cómo agregar un nuevo changelog

### 1. Editar `lib/changelog.ts`

Agregar la nueva entrada **AL INICIO** del array `CHANGELOG`:

```typescript
export const CHANGELOG: ChangelogEntry[] = [
  // ⬇️ Agregar AQUÍ (siempre al inicio)
  {
    version: '1.3.0', // Incrementar la versión
    date: '2025-10-20', // Fecha de hoy
    title: 'Título del Release',
    emoji: '🚀', // Emoji relacionado
    highlight: true, // true para releases importantes
    description: 'Descripción breve de qué trata este release.',
    features: ['Nueva funcionalidad 1', 'Nueva funcionalidad 2'],
    improvements: ['Mejora en X', 'Optimización de Y'],
    fixes: ['Corrección del bug Z'],
  },
  // Resto de entradas...
];
```

### 2. ¡Eso es todo!

El sistema automáticamente:

- Detectará la nueva versión
- Mostrará el modal a todos los usuarios
- Guardará que ya lo vieron cuando hagan click en "Entendido"

## 🎨 Opciones disponibles

### Campos de una entrada:

| Campo          | Tipo     | Requerido | Descripción                       |
| -------------- | -------- | --------- | --------------------------------- |
| `version`      | string   | ✅        | Número de versión (ej: "1.3.0")   |
| `date`         | string   | ✅        | Fecha en formato YYYY-MM-DD       |
| `title`        | string   | ✅        | Título del release                |
| `description`  | string   | ✅        | Descripción breve                 |
| `emoji`        | string   | ❌        | Emoji para el release             |
| `highlight`    | boolean  | ❌        | `true` para destacar (borde azul) |
| `features`     | string[] | ❌        | Lista de nuevas funcionalidades   |
| `improvements` | string[] | ❌        | Lista de mejoras                  |
| `fixes`        | string[] | ❌        | Lista de correcciones             |

### Emojis sugeridos:

- 🚀 Lanzamiento importante
- 🎨 Cambios de diseño
- ⚡ Performance
- 🔒 Seguridad
- 🐛 Bug fixes
- 📱 Mobile
- 🌐 Internacionalización
- 🔧 Configuración
- 📊 Analytics/Data
- 💰 Finanzas/Economía

## 💡 Ejemplos

### Release Simple (solo fixes)

```typescript
{
  version: '1.2.1',
  date: '2025-10-20',
  title: 'Correcciones Menores',
  emoji: '🐛',
  description: 'Arreglamos algunos bugs reportados por usuarios.',
  fixes: [
    'Corrección de error en gráfico de inflación',
    'Fix en responsive de tabla de favoritos',
  ],
}
```

### Release Importante (con todo)

```typescript
{
  version: '2.0.0',
  date: '2025-11-01',
  title: 'Dólar Gaucho 2.0',
  emoji: '🚀',
  highlight: true,
  description: 'El rediseño más grande de Dólar Gaucho hasta ahora.',
  features: [
    'Dashboard completamente renovado',
    'Alertas personalizadas por email',
    'API pública para desarrolladores',
    'Modo offline',
  ],
  improvements: [
    'Velocidad de carga 3x más rápida',
    'Diseño optimizado para tablets',
    'Nuevos gráficos interactivos',
  ],
  fixes: [
    'Corrección de errores de autenticación',
    'Fix en cálculo de brechas',
  ],
}
```

## 🧪 Cómo testear

### Método 1: Cambiar versión

1. Editar `lib/changelog.ts` y cambiar la versión del primer item
2. Refrescar la página
3. Debería aparecer el modal

### Método 2: Limpiar localStorage

1. Abrir DevTools (F12)
2. Ir a Application > Local Storage
3. Borrar la key `dg_last_seen_version`
4. Refrescar la página

### Método 3: Modo Incógnito

- Abrir el sitio en modo incógnito
- Siempre mostrará el modal

## 🎨 Personalización

### Cambiar colores del modal

Editar `components/WhatsNew.tsx`:

```typescript
// Cambiar color del backdrop
className = 'fixed inset-0 bg-black/60 backdrop-blur-sm';

// Cambiar color del botón
className = '... bg-brand ...';

// Cambiar color del confetti
className = '... bg-brand ...';
```

### Cambiar cantidad de entradas mostradas

En `components/WhatsNew.tsx` línea ~201:

```typescript
{
  CHANGELOG.slice(0, 3).map(renderEntry);
} // Cambiar el 3
```

### Deshabilitar confetti

En `components/WhatsNew.tsx` comentar/eliminar:

```typescript
// setShowConfetti(true); // Comentar esta línea
```

### Cambiar delay de aparición

En `components/WhatsNew.tsx` línea ~21:

```typescript
setTimeout(() => {
  setIsOpen(true);
  setShowConfetti(true);
}, 1000); // Cambiar 1000 (milisegundos)
```

## 📊 Métricas

Para saber cuántos usuarios vieron el changelog:

```typescript
// Agregar en handleClose():
console.log('User saw version:', getCurrentVersion());

// O enviar a analytics:
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', 'changelog_viewed', {
    version: getCurrentVersion(),
  });
}
```

## 🚫 Deshabilitar el sistema

Si querés deshabilitarlo temporalmente:

1. **Opción A**: Comentar en `_app.tsx`:

```typescript
// <WhatsNew />
```

2. **Opción B**: Agregar condición en `WhatsNew.tsx`:

```typescript
useEffect(() => {
  if (process.env.NODE_ENV !== 'production') return; // Solo en prod
  // ...
}, []);
```

## 🔄 Versionado Semántico

Recomendamos usar [Semantic Versioning](https://semver.org/lang/es/):

- **MAJOR** (1.0.0 → 2.0.0): Cambios que rompen compatibilidad
- **MINOR** (1.0.0 → 1.1.0): Nueva funcionalidad compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes compatibles

## ❓ FAQ

### ¿Puedo mostrar el modal manualmente?

Sí, exportá una función desde `WhatsNew.tsx`:

```typescript
export function showWhatsNew() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
```

### ¿Cómo hago que aparezca para todos los usuarios?

Incrementá la versión en `lib/changelog.ts`. Todos los que tengan una versión anterior verán el modal.

### ¿Se ve en todas las páginas?

Sí, porque está en `_app.tsx`. Pero podés condicionarlo:

```typescript
// Solo en homepage
{router.pathname === '/' && <WhatsNew />}
```

### ¿Funciona offline?

El modal usa localStorage, que funciona offline. Pero necesita que el usuario haya visitado la página online al menos una vez.

---

**¿Dudas?** Revisá el código en:

- `lib/changelog.ts` - Definición de changelogs
- `components/WhatsNew.tsx` - Componente visual
- `pages/_app.tsx` - Integración
