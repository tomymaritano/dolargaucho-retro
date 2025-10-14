# 🎭 Modo Demo - Sistema de Autenticación Simple

## ¿Qué es el Modo Demo?

El **Modo Demo** es un sistema de autenticación que funciona **completamente en el navegador** usando `localStorage`. No requiere base de datos, servidor, ni Supabase.

## ✅ Ventajas

- **Cero configuración**: Funciona inmediatamente sin setup
- **No requiere base de datos**: Todo se guarda en el navegador
- **Sin costos**: No necesita servicios externos
- **Perfecto para desarrollo**: Prueba rápidas sin setup complejo
- **Sin credenciales**: No necesitas API keys ni configuración

## 📦 ¿Qué Incluye?

✅ Registro de usuarios
✅ Login con email/password
✅ Sesiones persistentes
✅ Logout
✅ Preferencias de usuario
✅ Favoritos sincronizados
✅ Dashboard protegido

## 🚀 Cómo Activarlo

### Opción 1: Sin Supabase (Recomendado)

**Ya está activado por defecto si no hay configuración de Supabase.**

Simplemente asegurate que estas líneas estén comentadas en `.env.local`:

```bash
# Supabase DESACTIVADO - Modo Demo
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Opción 2: Forzar Modo Demo

Si querés forzar el modo demo incluso con Supabase configurado:

```typescript
// lib/auth/helpers.ts
export function getAuthMode(): 'supabase' | 'demo' {
  return 'demo'; // Forzar siempre modo demo
}
```

## 📖 Uso

### 1. Registro

```
URL: http://localhost:3000/register

Completa:
- Email: test@ejemplo.com
- Password: 123456 (mínimo 6 caracteres)
- Nombre: Test Usuario

Click en "Crear cuenta"
```

### 2. Login

```
URL: http://localhost:3000/login

Ingresa:
- Email: test@ejemplo.com
- Password: 123456

Click en "Iniciar sesión"
```

### 3. Dashboard

Después del login, serás redirigido automáticamente a:

```
http://localhost:3000/dashboard
```

### 4. Logout

Desde el dashboard, click en el botón de logout en la navbar.

## 🛠️ Cómo Funciona Internamente

### Detección Automática

El sistema detecta automáticamente si está en modo demo:

```typescript
// lib/auth/helpers.ts
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return !!(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
}

export function getAuthMode(): 'supabase' | 'demo' {
  return isSupabaseConfigured() ? 'supabase' : 'demo';
}
```

### Almacenamiento

Todo se guarda en `localStorage`:

```typescript
// Estructura de datos
localStorage.setItem('dg_demo_users', JSON.stringify({
  'test@ejemplo.com': {
    id: 'demo-test-ejemplo-com',
    email: 'test@ejemplo.com',
    password: 'hashedPassword',
    metadata: { name: 'Test Usuario' },
    created_at: '2025-01-10T...'
  }
}));

localStorage.setItem('dg_demo_session', JSON.stringify({
  user: { id: '...', email: '...' },
  expires_at: 1234567890
}));

localStorage.setItem('dg_demo_preferences', JSON.stringify({
  'demo-test-ejemplo-com': {
    theme: 'dark',
    favorite_dolares: ['blue', 'oficial'],
    favorite_currencies: ['EUR'],
    ...
  }
}));
```

### Hook de Demo

El sistema usa `useDemoAuth()` hook cuando está en modo demo:

```typescript
// hooks/useDemoAuth.ts
export function useDemoAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Métodos disponibles:
  const signUp = async (email, password, metadata) => { ... };
  const signIn = async (email, password) => { ... };
  const signOut = async () => { ... };
  const updatePreferences = async (prefs) => { ... };

  return { user, preferences, loading, signUp, signIn, signOut, updatePreferences };
}
```

### Context Provider

El `AuthProvider` cambia automáticamente entre Supabase y Demo:

```typescript
// lib/auth/auth-context.tsx
export function AuthProvider({ children }) {
  const [isDemoMode] = useState(() => getAuthMode() === 'demo');
  const demoAuth = useDemoAuth();

  const signIn = useCallback(async (email, password) => {
    if (isDemoMode) {
      await demoAuth.signIn(email, password);
      return { error: null };
    }
    // Supabase sign in...
  }, [isDemoMode, demoAuth]);

  return (
    <AuthContext.Provider value={{
      user: isDemoMode ? demoAuth.user : user,
      signIn,
      signOut,
      isDemoMode,
      ...
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 🎨 UI Indica el Modo

Cuando estás en modo demo, verás un banner en el login/register:

```
┌────────────────────────────────────────┐
│  🎭 Modo Demo                          │
│  Los datos se guardan en localStorage │
└────────────────────────────────────────┘
```

## 🔐 Seguridad

⚠️ **IMPORTANTE:** El modo demo es **solo para desarrollo**.

**NO uses modo demo en producción** porque:
- ❌ Las contraseñas se hashean pero están en el navegador
- ❌ Cualquiera con acceso al navegador puede ver los datos
- ❌ Los datos se pierden si se limpia el navegador
- ❌ No hay sincronización entre dispositivos

## 🔄 Migrar a Producción (Supabase)

Cuando estés listo para producción:

### 1. Configurá Supabase

Creá un proyecto en [supabase.com](https://supabase.com)

### 2. Agregá las credenciales

En `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
```

### 3. Ejecutá el script SQL

Copiá y ejecutá el contenido de `supabase/schema.sql` en Supabase SQL Editor.

### 4. Reiniciá el servidor

```bash
npm run dev
```

El sistema detectará automáticamente Supabase y cambiará de modo demo a producción. ✨

## 📊 Comparación: Demo vs Producción

| Feature | Modo Demo | Modo Producción (Supabase) |
|---------|-----------|----------------------------|
| **Configuración** | ✅ Ninguna | ⚠️ Requiere Supabase |
| **Base de datos** | localStorage | PostgreSQL |
| **Sincronización** | ❌ Solo local | ✅ Multi-dispositivo |
| **Email confirmación** | ❌ No | ✅ Sí |
| **OAuth (Google/GitHub)** | ❌ No | ✅ Sí |
| **Persistencia** | Browser only | ✅ Servidor |
| **Seguridad** | ⚠️ Básica | ✅ Enterprise |
| **Costo** | ✅ Gratis | ✅ Gratis (hasta 50k users) |
| **Para desarrollo** | ✅✅✅ Perfecto | ⚠️ Overkill |
| **Para producción** | ❌ No recomendado | ✅✅✅ Recomendado |

## 🧹 Limpiar Datos de Demo

Si querés resetear todos los datos:

### Desde DevTools Console

```javascript
// Borrar todos los datos de demo
localStorage.removeItem('dg_demo_users');
localStorage.removeItem('dg_demo_session');
localStorage.removeItem('dg_demo_preferences');
```

### O limpiar todo localStorage

```javascript
localStorage.clear();
```

## 🐛 Troubleshooting

### Problema: No puedo logearme

**Solución:** Verificá que el usuario esté registrado

```javascript
// En DevTools Console
JSON.parse(localStorage.getItem('dg_demo_users'))
```

Deberías ver tu usuario ahí.

### Problema: La sesión se pierde al recargar

**Solución:** Verificá que la sesión esté guardada

```javascript
// En DevTools Console
JSON.parse(localStorage.getItem('dg_demo_session'))
```

Si no hay sesión, registrate/logeate de nuevo.

### Problema: Dice "Credenciales inválidas"

**Causas posibles:**
1. Email o password incorrectos
2. Usuario no existe (registrate primero)
3. Password debe tener mínimo 6 caracteres

**Solución:** Registrá un nuevo usuario primero.

### Problema: Veo el banner de Demo pero quiero Supabase

**Solución:** Descomentá las variables en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
```

Y reiniciá el servidor.

## 📝 Testing

El sistema incluye tests para modo demo:

```bash
npm test -- auth-system.test.tsx
```

Los tests cubren:
- ✅ Registro de usuarios
- ✅ Login correcto
- ✅ Login con credenciales inválidas
- ✅ Validación de email
- ✅ Validación de password
- ✅ Sesiones persistentes
- ✅ Logout

## 💡 Tips

### Tip 1: Múltiples Usuarios

Podés registrar múltiples usuarios para testing:

```
Usuario 1: test1@ejemplo.com / 123456
Usuario 2: test2@ejemplo.com / 123456
Usuario 3: admin@ejemplo.com / admin123
```

Cada uno tendrá sus propias preferencias y favoritos.

### Tip 2: DevTools para Debug

Abrí DevTools → Application → Local Storage → localhost:3000

Vas a ver todas las keys:
- `dg_demo_users` - Todos los usuarios registrados
- `dg_demo_session` - Sesión actual
- `dg_demo_preferences` - Preferencias por usuario

### Tip 3: Simular Logout Forzado

Borrá solo la sesión:

```javascript
localStorage.removeItem('dg_demo_session');
location.reload();
```

### Tip 4: Ver Todos los Usuarios

```javascript
console.table(
  Object.entries(JSON.parse(localStorage.getItem('dg_demo_users') || '{}'))
    .map(([email, data]) => ({ email, id: data.id }))
);
```

## 🎯 Casos de Uso

### ✅ Cuándo Usar Modo Demo

- Desarrollo local
- Prototipos rápidos
- Testing de UI/UX
- Demos para clientes
- No querés configurar Supabase todavía
- Proyecto personal sin sincronización

### ❌ Cuándo NO Usar Modo Demo

- Aplicación en producción
- Necesitás sincronización multi-dispositivo
- Necesitás OAuth (Google/GitHub)
- Necesitás emails de confirmación
- Aplicación colaborativa
- Datos sensibles/importantes

## 🚀 Resumen

El **Modo Demo** te permite:

✨ Desarrollar y probar sin configuración
✨ Sistema de auth completo en minutos
✨ Migración fácil a producción cuando estés listo

**Estado actual:** Tu app está en **Modo Demo** ✅

**Login funcional:** http://localhost:3000/login
**Dashboard:** http://localhost:3000/dashboard

¡Todo listo para empezar a desarrollar! 🎉
