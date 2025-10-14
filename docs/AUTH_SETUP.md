# Sistema de Autenticación - Dólar Gaucho

Documentación completa del sistema de autenticación con Supabase y modo demo.

## 📋 Tabla de Contenidos

1. [Características](#características)
2. [Modo Demo vs Producción](#modo-demo-vs-producción)
3. [Configuración de Supabase](#configuración-de-supabase)
4. [Esquema de Base de Datos](#esquema-de-base-de-datos)
5. [Uso del Sistema](#uso-del-sistema)
6. [API de Leads](#api-de-leads)

## ✨ Características

- ✅ **Autenticación completa** con email/password
- ✅ **OAuth** con Google y GitHub
- ✅ **Modo Demo** sin necesidad de configuración
- ✅ **Protección de rutas** con middleware
- ✅ **Gestión de preferencias** de usuario
- ✅ **Sistema de leads** y suscripciones
- ✅ **Alertas de precio** (próximamente)
- ✅ **Calculadoras guardadas** (próximamente)

## 🎭 Modo Demo vs Producción

### Modo Demo (Sin Supabase)
- Los datos se guardan en `localStorage`
- Ideal para desarrollo y testing
- No requiere configuración
- Se activa automáticamente si no hay credenciales de Supabase

### Modo Producción (Con Supabase)
- Autenticación real con Supabase Auth
- Base de datos PostgreSQL
- OAuth con providers externos
- Emails de confirmación

## 🚀 Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que termine de inicializarse (1-2 minutos)

### 2. Obtener credenciales

En tu proyecto de Supabase:
1. Ve a **Settings** → **API**
2. Copia el **Project URL** y el **anon/public key**
3. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Configurar Auth Providers (Opcional)

#### Google OAuth
1. Ve a **Authentication** → **Providers** → **Google**
2. Habilita el provider
3. Sigue las instrucciones para crear OAuth app en Google Cloud Console
4. Agrega las credenciales en Supabase

#### GitHub OAuth
1. Ve a **Authentication** → **Providers** → **GitHub**
2. Habilita el provider
3. Crea una OAuth app en GitHub Settings
4. Agrega las credenciales en Supabase

### 4. Configurar URLs de Redirect

En **Authentication** → **URL Configuration**:
- **Site URL**: `http://localhost:3000` (desarrollo)
- **Redirect URLs**:
  - `http://localhost:3000/auth/callback`
  - `https://tu-dominio.com/auth/callback` (producción)

## 🗄️ Esquema de Base de Datos

Ejecuta estos scripts en el **SQL Editor** de Supabase:

### 1. Tabla de Preferencias de Usuario

```sql
-- Tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  favorite_dolares TEXT[] DEFAULT '{}',
  favorite_currencies TEXT[] DEFAULT '{}',
  dashboard_layout JSONB DEFAULT NULL,
  theme TEXT CHECK (theme IN ('dark', 'light', 'high-contrast')) DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT true,
  email_alerts BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own preferences
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Tabla de Leads

```sql
-- Tabla de leads para suscripciones
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT CHECK (source IN ('homepage', 'register', 'newsletter', 'cta', 'other')) DEFAULT 'other',
  status TEXT CHECK (status IN ('pending', 'confirmed', 'unsubscribed')) DEFAULT 'pending',
  subscribed_to_newsletter BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert leads (para el form de registro)
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view leads
CREATE POLICY "Only admins can view leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for faster email lookups
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
```

### 3. Tabla de Alertas de Precio (Opcional - Futuro)

```sql
-- Tabla de alertas de precio
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('dolar', 'cotizacion', 'inflacion')) NOT NULL,
  target_name TEXT NOT NULL,
  threshold DECIMAL(10, 2) NOT NULL,
  condition TEXT CHECK (condition IN ('above', 'below', 'change')) NOT NULL,
  notification_type TEXT CHECK (notification_type IN ('email', 'dashboard', 'both')) DEFAULT 'dashboard',
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own alerts
CREATE POLICY "Users can view own alerts"
  ON public.price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON public.price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON public.price_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON public.price_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_is_active ON public.price_alerts(is_active);
```

### 4. Tabla de Calculadoras Guardadas (Opcional - Futuro)

```sql
-- Tabla de cálculos guardados
CREATE TABLE IF NOT EXISTS public.saved_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  inputs JSONB NOT NULL,
  result JSONB NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.saved_calculations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own calculations
CREATE POLICY "Users can view own calculations"
  ON public.saved_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON public.saved_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON public.saved_calculations FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_saved_calculations_user_id ON public.saved_calculations(user_id);
CREATE INDEX idx_saved_calculations_type ON public.saved_calculations(type);
```

## 🔐 Uso del Sistema

### Hooks disponibles

```typescript
import { useAuth } from '@/lib/auth/auth-context';

function MyComponent() {
  const {
    user,              // Usuario actual
    session,           // Sesión actual
    preferences,       // Preferencias del usuario
    loading,           // Estado de carga
    signIn,            // Función para iniciar sesión
    signUp,            // Función para registrarse
    signOut,           // Función para cerrar sesión
    signInWithProvider,// OAuth (Google, GitHub)
    updatePreferences, // Actualizar preferencias
    isDemoMode,        // Modo demo activo
  } = useAuth();

  // Uso ejemplo
  const handleLogin = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) {
      console.error(error);
    }
  };

  return <div>{user ? `Hola ${user.email}` : 'No autenticado'}</div>;
}
```

### Proteger rutas

El middleware ya protege `/dashboard/*` automáticamente.

Para proteger componentes individuales:

```typescript
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function ProtectedComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return null;

  return <div>Contenido protegido</div>;
}
```

## 📧 API de Leads

### Endpoint

```
POST /api/leads
```

### Request Body

```json
{
  "email": "user@example.com",
  "name": "Juan Pérez",          // opcional
  "source": "homepage",           // homepage | register | newsletter | cta | other
  "subscribed_to_newsletter": true,
  "metadata": {                   // opcional
    "utm_source": "google",
    "utm_campaign": "verano2025"
  }
}
```

### Response

```json
{
  "success": true,
  "lead": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Juan Pérez",
    "source": "homepage",
    "status": "pending",
    "subscribed_to_newsletter": true,
    "metadata": {},
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
}
```

### Uso del componente LeadCaptureForm

```typescript
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

// En cualquier página
function HomePage() {
  return (
    <div>
      <h1>Bienvenido</h1>

      {/* Variante Card */}
      <LeadCaptureForm
        source="homepage"
        variant="card"
        title="Suscríbete al Newsletter"
        description="Recibe actualizaciones diarias"
        redirectOnSuccess={true}
      />

      {/* Variante Inline (sin Card) */}
      <LeadCaptureForm
        source="cta"
        variant="inline"
      />
    </div>
  );
}
```

## 🧪 Testing

Modo demo permite testing sin configuración:
1. No configures variables de entorno
2. La app usará localStorage automáticamente
3. Puedes probar login/registro sin backend

## 📝 Notas Importantes

1. **RLS (Row Level Security)**: Todas las tablas tienen RLS habilitado para seguridad
2. **Modo Demo**: Perfecto para desarrollo, pero cambia a producción para deploy
3. **OAuth**: Requiere configuración adicional en cada provider
4. **Emails**: Supabase envía emails de confirmación automáticamente
5. **GDPR**: Los usuarios pueden eliminar sus datos desde Supabase Auth

## 🔄 Próximos Pasos

1. [x] Sistema de autenticación básico
2. [x] Páginas de login y registro
3. [x] Protección de rutas
4. [x] Sistema de leads
5. [ ] Emails de bienvenida personalizados
6. [ ] Dashboard de admin para leads
7. [ ] Alertas de precio activas
8. [ ] Calculadoras guardadas

## 🆘 Soporte

Si tienes problemas:
1. Revisa que las variables de entorno estén correctas
2. Verifica que las tablas estén creadas en Supabase
3. Revisa la consola del navegador para errores
4. En desarrollo, usa modo demo para testing rápido
