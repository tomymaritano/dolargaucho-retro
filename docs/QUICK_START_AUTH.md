# Quick Start - Sistema de Autenticación

Guía rápida para empezar a usar el sistema de autenticación.

## 🚀 Inicio Rápido (Modo Demo)

El sistema funciona **sin configuración** usando localStorage:

```bash
# 1. Instala dependencias (si no lo hiciste)
npm install

# 2. Inicia el servidor
npm run dev

# 3. Accede a las páginas
# Login: http://localhost:3000/login
# Registro: http://localhost:3000/register
# Dashboard: http://localhost:3000/dashboard
```

**¡Listo!** El sistema funciona en modo demo sin necesidad de configurar nada.

## 🔐 Modo Producción (Con Supabase)

### Paso 1: Configurar Supabase

1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales

### Paso 2: Variables de entorno

Crea `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
```

### Paso 3: Crear tablas

En Supabase → SQL Editor, ejecuta:

```sql
-- Ver archivo completo en docs/AUTH_SETUP.md
-- O copia el script de la sección "Esquema de Base de Datos"
```

### Paso 4: Reiniciar servidor

```bash
npm run dev
```

**¡Listo!** Ahora tienes autenticación real con Supabase.

## 📋 Funcionalidades Disponibles

### Para Usuarios
- ✅ Registro con email/password
- ✅ Login con email/password
- ✅ OAuth con Google/GitHub (requiere configuración)
- ✅ Dashboard protegido
- ✅ Suscripción a newsletter
- ✅ Preferencias personalizadas

### Para Desarrolladores
- ✅ Hook `useAuth()` para cualquier componente
- ✅ Middleware automático de protección
- ✅ API `/api/leads` para capturar emails
- ✅ Componente `<LeadCaptureForm />` listo para usar
- ✅ Modo demo para testing sin backend

## 🎯 Usar en tu código

### Proteger una página

```typescript
// pages/mi-pagina-protegida.tsx
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MiPaginaProtegida() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return null;

  return <div>Contenido solo para usuarios autenticados</div>;
}
```

### Capturar leads

```typescript
// pages/index.tsx
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

export default function Home() {
  return (
    <div>
      <h1>Suscríbete</h1>
      <LeadCaptureForm
        source="homepage"
        variant="card"
        redirectOnSuccess={true}
      />
    </div>
  );
}
```

### Usar datos del usuario

```typescript
import { useAuth } from '@/lib/auth/auth-context';

function MiComponente() {
  const { user, preferences, signOut } = useAuth();

  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Tema: {preferences?.theme}</p>
      <button onClick={signOut}>Cerrar sesión</button>
    </div>
  );
}
```

## 📊 Ver Leads Capturados

### Modo Demo
Los leads se guardan en localStorage y se muestran en consola:
```javascript
// Abrir DevTools → Console
// Verás: [Demo Mode] Lead captured: {...}
```

### Modo Producción
Accede a Supabase → Table Editor → `leads`

## 🔄 Cambiar de Modo Demo a Producción

1. **Configurar** variables en `.env.local`
2. **Crear** tablas en Supabase
3. **Reiniciar** el servidor
4. **Migrar** usuarios de demo (opcional):
   ```typescript
   // Los usuarios de demo tienen localStorage
   // Al configurar Supabase, deben registrarse nuevamente
   ```

## ❓ FAQ

**Q: ¿Funciona sin Supabase?**
A: Sí, en modo demo con localStorage.

**Q: ¿Puedo usar otro backend?**
A: Sí, modifica `lib/auth/auth-context.tsx` y usa tu API.

**Q: ¿Los leads se pierden en demo?**
A: Se guardan en localStorage del navegador.

**Q: ¿Cómo sé si estoy en modo demo?**
A: Aparece un banner verde "🎭 Modo Demo" en login/register.

**Q: ¿El middleware funciona en demo?**
A: Sí, pero solo en cliente (no server-side).

## 🆘 Problemas Comunes

### "Cannot find module 'types/database'"
- **Solución**: Las types se generan automáticamente. En demo mode no se necesitan.

### "Infinite loop" o "Too many re-renders"
- **Solución**: Las preferencias están deshabilitadas por defecto. Se habilitan cuando la tabla existe.

### Dashboard redirige a login
- **Solución**: En modo demo, haz login primero. En producción, verifica las cookies de Supabase.

## 📚 Documentación Completa

Ver [AUTH_SETUP.md](./AUTH_SETUP.md) para:
- Scripts SQL completos
- Configuración de OAuth
- Gestión de preferencias
- API de leads detallada
- Políticas de seguridad (RLS)

## ✅ Checklist de Configuración

- [ ] Servidor corriendo en http://localhost:3000
- [ ] Puedo acceder a /login
- [ ] Puedo registrarme en /register
- [ ] El dashboard está protegido
- [ ] Los leads se capturan (ver consola en demo)
- [ ] (Opcional) Supabase configurado
- [ ] (Opcional) Tablas creadas en Supabase
- [ ] (Opcional) OAuth configurado

---

**¿Listo?** Prueba ir a `/login` y crear una cuenta 🚀
